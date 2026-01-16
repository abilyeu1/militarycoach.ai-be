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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const chats_schema_1 = require("../../schemas/chats/chats.schema");
const user_schema_1 = require("../../schemas/users/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ChatsService = class ChatsService {
    constructor(chatModel, userModel) {
        this.chatModel = chatModel;
        this.userModel = userModel;
    }
    async saveChat(chat, userID) {
        try {
            if (chat.chatID) {
                await this.chatModel.findByIdAndUpdate({ _id: chat.chatID }, chat, {
                    new: true,
                });
                return {
                    message: 'Chat updated successfully.',
                };
            }
            const newChat = new this.chatModel(Object.assign(Object.assign({}, chat), { userID: userID }));
            await newChat.save();
            return {
                message: 'Chat saved successfully.',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getChatById(user_id, chat_id) {
        try {
            const userExist = await this.userModel.findById(user_id);
            if (!userExist) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const chatById = await this.chatModel.findById(chat_id);
            if (!chatById) {
                throw new common_1.HttpException('Chat by id not found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                chat: chatById,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getChatBySlug(user_id, slug) {
        try {
            const userExist = await this.userModel.findById(user_id);
            if (!userExist) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const chatBySlug = await this.chatModel.find({
                userID: user_id,
                toolName: slug,
            });
            if (chatBySlug.length === 0) {
                throw new common_1.HttpException('Chat by slug not found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                chats: chatBySlug,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteChatById(user_id, chat_id) {
        try {
            const userExist = await this.userModel.findById(user_id);
            if (!userExist) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const chatById = await this.chatModel.findByIdAndDelete(chat_id);
            if (!chatById) {
                throw new common_1.HttpException('Chat by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                message: 'Chat by Id is deleted successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chats_schema_1.Chat.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatsService);
exports.ChatsService = ChatsService;
//# sourceMappingURL=chat.service.js.map