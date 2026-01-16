"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenaiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const openai_1 = require("openai");
const mongoose_2 = require("mongoose");
const common_enum_1 = require("../../types/enums/common.enum");
const tools_enum_1 = require("../../types/enums/tools.enum");
const chats_schema_1 = require("../../schemas/chats/chats.schema");
const tools_schema_1 = require("../../schemas/tools/tools.schema");
const user_schema_1 = require("../../schemas/users/user.schema");
const stream_gateway_1 = require("../../stream.gateway");
const ResumeJSONNormalizer_1 = require("../../base_prompts/ResumeJSONNormalizer");
const bulletTranslator_1 = require("../../base_prompts/bulletTranslator");
const careerWizard_1 = require("../../base_prompts/careerWizard");
const coverLetterWizard_1 = require("../../base_prompts/coverLetterWizard");
const mockInterviewPrep_1 = require("../../base_prompts/mockInterviewPrep");
const skillsGapAnalysis_1 = require("../../base_prompts/skillsGapAnalysis");
const recommendIndustry_1 = require("../../base_prompts/recommendIndustry");
let OpenaiService = class OpenaiService {
    constructor(configService, userModel, toolModel, chatModel, streamService) {
        this.configService = configService;
        this.userModel = userModel;
        this.toolModel = toolModel;
        this.chatModel = chatModel;
        this.streamService = streamService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('app.openai_secret'),
        });
    }
    async fetchConversation(userID, toolName, chatID) {
        var _a;
        try {
            const chat = await this.chatModel.findOne({
                userID,
                toolName,
                _id: chatID,
            });
            return { conversation: chat, id: (_a = chat === null || chat === void 0 ? void 0 : chat._id.toHexString()) !== null && _a !== void 0 ? _a : null };
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }
    async checkAndUpdateMessageLimit(userID) {
        const user = await this.userModel.findById(userID);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.stripeSubscriptionStatus === common_enum_1.StripeStatus.PAST_DUE) {
            throw new common_1.HttpException('Your Subscription status is past_due. Your attached card is declined', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.stripeSubscriptionStatus === common_enum_1.StripeStatus.CANCELED) {
            throw new common_1.HttpException('Your Subscription status is cancelled, please subscribe again to continue using the tool.', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.stripeSubscriptionStatus === common_enum_1.StripeStatus.INCOMPLETE) {
            throw new common_1.HttpException('Your Subscription status is incomplete, please subscribe again to continue using the tool.', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.stripeSubscriptionStatus === common_enum_1.StripeStatus.FREE) {
            const userCreatedAt = user.createdAt;
            const currentTime = new Date();
            const diffTime = Math.abs(currentTime.getTime() - new Date(userCreatedAt).getTime());
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            if (user.messagesConsumed >= user.messagesLimit ||
                diffHours >= user.freeUserHoursLimit ||
                user.freeMessagesLimitExhausted) {
                throw new common_1.HttpException('Your free messages limit is exhausted. Purchase a subscription to continue using the tool.', common_1.HttpStatus.PAYMENT_REQUIRED);
            }
            return;
        }
        if (user.stripeSubscriptionStatus === common_enum_1.StripeStatus.ACTIVE) {
            if (user.messagesConsumed >= user.messagesLimit &&
                user.freeMessagesLimitExhausted) {
                throw new common_1.HttpException('You messages limit is exhausted. Upgrade to a higher plan to continue using the tool.', common_1.HttpStatus.PAYMENT_REQUIRED);
            }
            return;
        }
        return;
        const paidUserStatus = [common_enum_1.StripeStatus.ACTIVE, common_enum_1.StripeStatus.CANCELED];
        if (paidUserStatus.includes(user.stripeSubscriptionStatus))
            return;
        if (user.messagesConsumed >= user.messagesLimit ||
            user.freeMessagesLimitExhausted) {
            await this.userModel.findOneAndUpdate({ _id: userID }, { freeMessagesLimitExhausted: true }, { new: true, upsert: true });
            throw new common_1.HttpException('You have exhausted your free messages limit. Please subscribe to continue using the tool.', common_1.HttpStatus.PAYMENT_REQUIRED);
        }
        return;
    }
    async updateToolCountAndUserMessageCount(toolName, userID) {
        await this.toolModel.findOneAndUpdate({ name: toolName }, { $inc: { noOfTimeUsed: 1 } });
        const user = await this.userModel.findOneAndUpdate({ _id: userID }, { $inc: { messagesConsumed: 1 } }, { new: true, upsert: true });
        if (user.stripeSubscriptionStatus === common_enum_1.StripeStatus.ACTIVE) {
            return { user };
        }
        if (user.messagesConsumed >= user.messagesLimit) {
            const user = await this.userModel.findOneAndUpdate({ _id: userID }, { freeMessagesLimitExhausted: true }, { new: true, upsert: true });
            return { user };
        }
        return { user };
    }
    async bulletTranslator(userID, bullet) {
        var _a, e_1, _b, _c;
        let message;
        await this.checkAndUpdateMessageLimit(userID);
        const basePrompt = (0, bulletTranslator_1.bulletTranslator)(bullet);
        try {
            const stream = await this.openai.chat.completions.create({
                model: process.env.OPEN_AI_MODEL,
                messages: [{ role: 'system', content: basePrompt }],
                stream: true,
                max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
                temperature: parseFloat(process.env.OPEN_AI_TEMP),
                top_p: 1,
            });
            try {
                for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = await stream_1.next(), _a = stream_1_1.done, !_a;) {
                    _c = stream_1_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        this.streamService.handleMessage(userID, chunk.choices[0].delta.content, null, tools_enum_1.Tools.BULLET_TRANSLATOR);
                        message += chunk.choices[0].delta.content || '';
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_1.return)) await _b.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        const { user } = await this.updateToolCountAndUserMessageCount(tools_enum_1.Tools.BULLET_TRANSLATOR, userID);
        return { message: message.replace('undefined', '').trim(), user };
    }
    async careerWizard(chatID, userID, { message, promptDetails }) {
        var _a, e_2, _b, _c;
        let content;
        const user = await this.userModel.findById(userID);
        const basePrompt = (0, careerWizard_1.basePrompt_CW)(promptDetails);
        const filteredMessage = message.filter((msg) => msg.role !== 'system');
        try {
            const stream = await this.openai.chat.completions.create({
                model: process.env.OPEN_AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: basePrompt,
                    },
                    ...filteredMessage,
                ],
                stream: true,
                max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
                temperature: parseFloat(process.env.OPEN_AI_TEMP),
                top_p: 1,
            });
            try {
                for (var _d = true, stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = await stream_2.next(), _a = stream_2_1.done, !_a;) {
                    _c = stream_2_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        if (chunk.choices[0].delta.content === 'undefined')
                            continue;
                        this.streamService.handleMessage(userID, chunk.choices[0].delta.content, chatID, tools_enum_1.Tools.CAREER_WIZARD);
                        content += chunk.choices[0].delta.content || '';
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_2.return)) await _b.call(stream_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        await this.toolModel.findOneAndUpdate({ name: tools_enum_1.Tools.CAREER_WIZARD }, { $inc: { noOfTimeUsed: 1 } });
        return {
            content: content.replace('undefined', '').trim(),
            basePrompt,
            user,
        };
    }
    async coverLetterWizard(userID, promptDetails) {
        var _a, e_3, _b, _c;
        let content;
        await this.checkAndUpdateMessageLimit(userID);
        const basePrompt = (0, coverLetterWizard_1.basePrompt_CLW)(promptDetails);
        try {
            const stream = await this.openai.chat.completions.create({
                model: process.env.OPEN_AI_MODEL,
                messages: [
                    {
                        role: 'assistant',
                        content: basePrompt,
                    },
                ],
                stream: true,
                max_tokens: 1000,
                temperature: parseFloat(process.env.OPEN_AI_TEMP),
                top_p: 1,
            });
            try {
                for (var _d = true, stream_3 = __asyncValues(stream), stream_3_1; stream_3_1 = await stream_3.next(), _a = stream_3_1.done, !_a;) {
                    _c = stream_3_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        if (chunk.choices[0].delta.content === 'undefined')
                            continue;
                        this.streamService.handleMessage(userID, chunk.choices[0].delta.content, null, tools_enum_1.Tools.COVER_LETTER_WIZARD);
                        content += chunk.choices[0].delta.content || '';
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_3.return)) await _b.call(stream_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        const { user } = await this.updateToolCountAndUserMessageCount(tools_enum_1.Tools.COVER_LETTER_WIZARD, userID);
        return { content: content.replace('undefined', '').trim(), user };
    }
    async mockInterview(chatID, userID, { message, promptDetails }) {
        var _a, e_4, _b, _c;
        let content;
        await this.checkAndUpdateMessageLimit(userID);
        const basePrompt = (0, mockInterviewPrep_1.basePrompt_MI)(promptDetails);
        const filteredMessage = message.filter((msg) => msg.role !== 'system');
        try {
            const stream = await this.openai.chat.completions.create({
                model: process.env.OPEN_AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: basePrompt,
                    },
                    ...filteredMessage,
                ],
                stream: true,
                max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
                temperature: parseFloat(process.env.OPEN_AI_TEMP),
                top_p: 1,
            });
            try {
                for (var _d = true, stream_4 = __asyncValues(stream), stream_4_1; stream_4_1 = await stream_4.next(), _a = stream_4_1.done, !_a;) {
                    _c = stream_4_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        if (chunk.choices[0].delta.content === 'undefined')
                            continue;
                        this.streamService.handleMessage(userID, chunk.choices[0].delta.content, chatID, tools_enum_1.Tools.MOCK_INTERVIEW_PREP);
                        content += chunk.choices[0].delta.content || '';
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_4.return)) await _b.call(stream_4);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        const { user } = await this.updateToolCountAndUserMessageCount(tools_enum_1.Tools.MOCK_INTERVIEW_PREP, userID);
        return {
            content: content.replace('undefined', '').trim(),
            basePrompt,
            user,
        };
    }
    async skillsGapAnalysis(chatID, userID, { message, promptDetails }) {
        var _a, e_5, _b, _c;
        let content;
        await this.checkAndUpdateMessageLimit(userID);
        const basePrompt = (0, skillsGapAnalysis_1.basePrompt_SGA)(promptDetails);
        const filteredMessage = message.filter((msg) => msg.role !== 'system');
        try {
            const stream = await this.openai.chat.completions.create({
                model: process.env.OPEN_AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: basePrompt,
                    },
                    ...filteredMessage,
                ],
                stream: true,
                max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
                temperature: parseFloat(process.env.OPEN_AI_TEMP),
                top_p: 1,
            });
            try {
                for (var _d = true, stream_5 = __asyncValues(stream), stream_5_1; stream_5_1 = await stream_5.next(), _a = stream_5_1.done, !_a;) {
                    _c = stream_5_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        const responseContent = chunk.choices[0].delta.content;
                        if (!responseContent ||
                            responseContent.toLowerCase().includes('undefined')) {
                            continue;
                        }
                        this.streamService.handleMessage(userID, responseContent, chatID, tools_enum_1.Tools.SKILLS_GAP_ANALYSIS);
                        content += responseContent || '';
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_5.return)) await _b.call(stream_5);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        const { user } = await this.updateToolCountAndUserMessageCount(tools_enum_1.Tools.SKILLS_GAP_ANALYSIS, userID);
        return {
            content: content.replace('undefined', '').trim(),
            basePrompt,
            user,
        };
    }
    async recommendIndustry(userID) {
        const { age, fullName, branchOfService, languages, education, certificates, workExperience, } = await this.userModel.findById(userID);
        const basePrompt = (0, recommendIndustry_1.basePrompt_RI)({
            age,
            name: fullName,
            branchOfService,
            languages,
            educations: education,
            professionalCertificates: certificates,
            careers: workExperience,
        });
        try {
            const response = await this.openai.chat.completions.create({
                model: process.env.OPEN_AI_MODEL,
                messages: [{ role: 'system', content: basePrompt }],
                max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
                temperature: parseFloat(process.env.OPEN_AI_TEMP),
                top_p: 1,
            });
            return { recommendations: response.choices[0].message.content };
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async parseCV(file) {
        try {
            console.time('Time in seconds to parse and normalize user resume');
            const fileBuffer = Buffer.from(file.buffer);
            const uploadedFile = await this.createOpenAIFile(fileBuffer);
            const assistant = await this.openai.beta.assistants.retrieve('asst_zVuBcl71594b5ulGFJhmoHEJ');
            console.log('Assistant Retrieved');
            const thread = await this.openai.beta.threads.create();
            console.log('Thread Retrieved');
            await this.createOpenAIMessage(thread.id, uploadedFile.id);
            console.log('Message Created');
            const run = await this.openai.beta.threads.runs.create(thread.id, {
                assistant_id: assistant.id,
            });
            console.log('Steps Queued...');
            await this.waitForRunCompletion(thread.id, run.id);
            const messages = await this.openai.beta.threads.messages.list(thread.id);
            console.log('Messages Retrieved');
            console.timeEnd('Time in seconds to parse and normalize user resume');
            const resp = messages.data[0].content[0];
            const jsonResponse = resp.text.value
                .replace(/^`{3}\s*JSON\s*/i, '')
                .replace(/`{3}\s*$/i, '');
            return jsonResponse;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createOpenAIFile(file) {
        return await this.openai.files.create({
            file: await (0, openai_1.toFile)(file, file.originalname),
            purpose: 'assistants',
        });
    }
    async createOpenAIMessage(threadId, fileId) {
        return await this.openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: ResumeJSONNormalizer_1.ResumeParserBasePrompt,
            file_ids: [fileId],
        });
    }
    async waitForRunCompletion(threadId, runId) {
        const maxAttempts = 100;
        const pollInterval = 2000;
        let attempts = 0;
        while (attempts < maxAttempts) {
            const runStatus = await this.openai.beta.threads.runs.retrieve(threadId, runId);
            console.log('RUN 6', { runStatus: runStatus.status }, runStatus.started_at);
            console.log('attempts', attempts);
            switch (runStatus.status) {
                case 'completed':
                    console.log('Completed', runStatus.completed_at);
                    return;
                case 'failed':
                case 'cancelled':
                case 'expired':
                    console.log('Failed', runStatus);
                    throw new Error(`Run failed with status: ${runStatus.status}`);
                default:
                    await new Promise((resolve) => setTimeout(resolve, pollInterval));
                    attempts++;
            }
        }
        throw new Error('Timeout: Run did not complete within the expected time');
    }
};
OpenaiService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(tools_schema_1.Tool.name)),
    __param(3, (0, mongoose_1.InjectModel)(chats_schema_1.Chat.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        stream_gateway_1.StreamGateway])
], OpenaiService);
exports.OpenaiService = OpenaiService;
//# sourceMappingURL=openai.service.js.map