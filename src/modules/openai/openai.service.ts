// NestJS Imports
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

// OPEN-AI Imports
import OpenAI, { toFile } from 'openai';

// Mongoose Imports
import { Model } from 'mongoose';

// ENUM Imports
import { StripeStatus } from 'src/types/enums/common.enum';
import { Tools } from 'src/types/enums/tools.enum';

// Schema, Type & DTO Imports
import { Chat } from 'src/schemas/chats/chats.schema';
import { Tool } from 'src/schemas/tools/tools.schema';
import { User, UserDocument } from 'src/schemas/users/user.schema';
import IUser from '../users/interface/user.interface';
import { ICareerWizard } from './interface/careerWizard.interface';
import { IChat } from './interface/chat.type';
import { ICoverLetterWizard } from './interface/coverLetterWizard.interface';
import { IMockInterview } from './interface/mockInterview.interface';
import { ISkillsGapAnalysis } from './interface/skillsGapAnalysis.interface';

// Gateway Imports
import { StreamGateway } from 'src/stream.gateway';

// Base Prompt Imports
import { ResumeParserBasePrompt } from 'src/base_prompts/ResumeJSONNormalizer';
import { bulletTranslator } from 'src/base_prompts/bulletTranslator';
import { basePrompt_CW } from 'src/base_prompts/careerWizard';
import { basePrompt_CLW } from 'src/base_prompts/coverLetterWizard';
import { basePrompt_MI } from 'src/base_prompts/mockInterviewPrep';
import { basePrompt_SGA } from 'src/base_prompts/skillsGapAnalysis';
import { basePrompt_RI } from 'src/base_prompts/recommendIndustry';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Tool.name) private toolModel: Model<Tool>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private streamService: StreamGateway,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('app.openai_secret'),
    });
  }

  /**
   * @description Fetches the conversation from the database according to the user ID and tool name.
   * @params userID - The user ID.
   * @params toolName - The tool name.
   * @returns {Promise<{conversation: IChat; id: string | null}>} Returns a Promise that resolves to a IChat object.
   */
  async fetchConversation(
    userID: string,
    toolName: Tools,
    chatID?: string,
  ): Promise<{ conversation: IChat; id: string | null }> {
    try {
      const chat = await this.chatModel.findOne({
        userID,
        toolName,
        _id: chatID,
      });
      return { conversation: chat, id: chat?._id.toHexString() ?? null };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   * @description Checks if the user has exhausted their free messages limit and updates the database accordingly.
   * @param {string} userID - The unique identifier for the user.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  async checkAndUpdateMessageLimit(userID: string): Promise<void> {
    const user = await this.userModel.findById(userID);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.stripeSubscriptionStatus === StripeStatus.PAST_DUE) {
      throw new HttpException(
        'Your Subscription status is past_due. Your attached card is declined',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.stripeSubscriptionStatus === StripeStatus.CANCELED) {
      throw new HttpException(
        'Your Subscription status is cancelled, please subscribe again to continue using the tool.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.stripeSubscriptionStatus === StripeStatus.INCOMPLETE) {
      throw new HttpException(
        'Your Subscription status is incomplete, please subscribe again to continue using the tool.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.stripeSubscriptionStatus === StripeStatus.FREE) {
      const userCreatedAt = user.createdAt;

      const currentTime = new Date();

      const diffTime = Math.abs(
        currentTime.getTime() - new Date(userCreatedAt).getTime(),
      );

      // Convert milliseconds to hours, to check if the user free hours limit is exhausted or not.
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

      if (
        user.messagesConsumed >= user.messagesLimit ||
        diffHours >= user.freeUserHoursLimit ||
        user.freeMessagesLimitExhausted
      ) {
        throw new HttpException(
          'Your free messages limit is exhausted. Purchase a subscription to continue using the tool.',
          HttpStatus.PAYMENT_REQUIRED,
        );
      }

      return;
    }

    if (user.stripeSubscriptionStatus === StripeStatus.ACTIVE) {
      if (
        user.messagesConsumed >= user.messagesLimit &&
        user.freeMessagesLimitExhausted
      ) {
        throw new HttpException(
          'You messages limit is exhausted. Upgrade to a higher plan to continue using the tool.',
          HttpStatus.PAYMENT_REQUIRED,
        );
      }

      return;
    }
    return;
    /**
     * 1. Paid user are ACTIVE
     * 2. Cancelled user are those who have cancelled their subscription, but have access to milcoach platform until the end of their billing cycle.
     * 2a => They can use the tool until the end of their billing cycle.
     * 2b => At the end of their billing cycle, their status will be changed to FREE via Stripe webhook.
     * 2c => Then the user message consumption will be checked and updated accordingly.
     * 2d => If the user has exhausted their free messages limit, then they will be asked to subscribe to continue using the tool.
     */
    const paidUserStatus = [StripeStatus.ACTIVE, StripeStatus.CANCELED];

    if (paidUserStatus.includes(user.stripeSubscriptionStatus)) return;

    if (
      user.messagesConsumed >= user.messagesLimit ||
      user.freeMessagesLimitExhausted
    ) {
      // update user freeMessagesLimitExhausted to true
      await this.userModel.findOneAndUpdate(
        { _id: userID },
        { freeMessagesLimitExhausted: true },
        { new: true, upsert: true },
      );

      throw new HttpException(
        'You have exhausted your free messages limit. Please subscribe to continue using the tool.',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return;
  }

  /**
   * @description Updates the tool count and user message count in the database.
   * @param {Tools} toolName - The name of the tool.
   * @param {string} userID - The unique identifier for the user.
   * @returns {Promise<void>} A Promise that resolves to void.
   */
  async updateToolCountAndUserMessageCount(
    toolName: Tools,
    userID: string,
  ): Promise<{ user: IUser }> {
    // update count in tool once the tool is used
    await this.toolModel.findOneAndUpdate(
      { name: toolName },
      { $inc: { noOfTimeUsed: 1 } },
    );

    // update user message count
    const user: IUser = await this.userModel.findOneAndUpdate(
      { _id: userID },
      { $inc: { messagesConsumed: 1 } },
      { new: true, upsert: true },
    );

    if (user.stripeSubscriptionStatus === StripeStatus.ACTIVE) {
      return { user };
    }

    if (user.messagesConsumed >= user.messagesLimit) {
      const user: IUser = await this.userModel.findOneAndUpdate(
        { _id: userID },
        { freeMessagesLimitExhausted: true },
        { new: true, upsert: true },
      );

      return { user };
    }

    return { user };
  }

  // ================================================================= TOOLS =================================================================

  // =================== 1. Bullet Translator ======================
  /**
   * @description Translates military-specific jargon and acronyms from a bullet point into language easily understood by civilian employers.
   * @param {string} userID - The unique identifier for the user.
   * @param {string} bullet - The bullet point containing military jargon to be translated.
   * @returns {Promise<{ message: string }>} A Promise that resolves to the translated message as a string.
   */
  async bulletTranslator(
    userID: string,
    bullet: string,
  ): Promise<{ message: string; user: IUser }> {
    // Function level variables
    let message: string;

    await this.checkAndUpdateMessageLimit(userID);

    const basePrompt = bulletTranslator(bullet);

    try {
      const stream = await this.openai.chat.completions.create({
        model: process.env.OPEN_AI_MODEL as string,
        messages: [{ role: 'system', content: basePrompt }],
        stream: true,
        max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
        temperature: parseFloat(process.env.OPEN_AI_TEMP),
        top_p: 1,
      });

      for await (const chunk of stream) {
        this.streamService.handleMessage(
          userID,
          chunk.choices[0].delta.content as string,
          null,
          Tools.BULLET_TRANSLATOR,
        );

        message += (chunk.choices[0].delta.content as string) || '';
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    const { user } = await this.updateToolCountAndUserMessageCount(
      Tools.BULLET_TRANSLATOR,
      userID,
    );

    return { message: message.replace('undefined', '').trim(), user };
  }

  // =================== 2. Career Wizard ( FREE TOOL ) ======================
  /**
   * @description This endpoint processes a user profile and generates a career wizard response using OpenAI's chat completions.
   * @param {string} userID - The unique identifier for the user.
   * @param {ICareerWizard} careerWizardData - The input data containing message and prompt details for the career wizard.
   * @returns {Promise<{content: string}>} A Promise that resolves to the career wizard response as a string.
   */
  async careerWizard(
    chatID: string,
    userID: string,
    { message, promptDetails }: ICareerWizard,
  ): Promise<{ content: string; basePrompt: string; user: IUser }> {
    // Function level variables
    let content: string;

    const user: IUser = await this.userModel.findById(userID);

    const basePrompt = basePrompt_CW(promptDetails);

    const filteredMessage = message.filter((msg) => msg.role !== 'system');

    try {
      const stream = await this.openai.chat.completions.create({
        model: process.env.OPEN_AI_MODEL as string,
        messages: [
          {
            role: 'system',
            content: basePrompt,
          },
          // @ts-ignore
          ...filteredMessage,
        ],
        stream: true,
        max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
        temperature: parseFloat(process.env.OPEN_AI_TEMP),
        top_p: 1,
      });

      for await (const chunk of stream) {
        if (chunk.choices[0].delta.content === 'undefined') continue;

        this.streamService.handleMessage(
          userID,
          chunk.choices[0].delta.content as string,
          chatID,
          Tools.CAREER_WIZARD,
        );

        content += (chunk.choices[0].delta.content as string) || '';
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    await this.toolModel.findOneAndUpdate(
      { name: Tools.CAREER_WIZARD },
      { $inc: { noOfTimeUsed: 1 } },
    );

    return {
      content: content.replace('undefined', '').trim(),
      basePrompt,
      user,
    };
  }

  // =================== 3. Cover Letter Wizard ======================
  /**
   * @description This endpoint processes a user profile and generates a cover letter wizard response using OpenAI's chat completions.
   * @param {string} userID - The unique identifier for the user.
   * @param {ICoverLetterWizard} coverLetterWizardData - The input data containing message and prompt details for the cover letter wizard.
   * @returns {Promise<{content: string}>} A Promise that resolves to the cover letter wizard response as a string.
   */
  async coverLetterWizard(
    userID: string,
    promptDetails: ICoverLetterWizard,
  ): Promise<{ content: string; user: IUser }> {
    // Function level variables
    let content: string;

    await this.checkAndUpdateMessageLimit(userID);

    const basePrompt = basePrompt_CLW(promptDetails);

    try {
      const stream = await this.openai.chat.completions.create({
        model: process.env.OPEN_AI_MODEL as string,
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

      for await (const chunk of stream) {
        if (chunk.choices[0].delta.content === 'undefined') continue;

        this.streamService.handleMessage(
          userID,
          chunk.choices[0].delta.content as string,
          null,
          Tools.COVER_LETTER_WIZARD,
        );

        content += (chunk.choices[0].delta.content as string) || '';
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    const { user } = await this.updateToolCountAndUserMessageCount(
      Tools.COVER_LETTER_WIZARD,
      userID,
    );
    return { content: content.replace('undefined', '').trim(), user };
  }

  // =================== 4. Mock Interview Prep ======================
  /**
   * @description This endpoint processes a user profile and generates some mock interview questions using OpenAI's chat completion API.
   * @param {string} userID - The unique identifier for the user.
   * @param {IMockInterview} mockInterviewData - The input data containing message and prompt details for the mock interview.
   * @returns {Promise<{content: string}>} A Promise that resolves to the mock interview response as a string.
   */
  async mockInterview(
    chatID: string,
    userID: string,
    { message, promptDetails }: IMockInterview,
  ): Promise<{ content: string; basePrompt: string; user: IUser }> {
    // Function level variables
    let content: string;

    await this.checkAndUpdateMessageLimit(userID);

    const basePrompt = basePrompt_MI(promptDetails);

    // filter our role === system messages from the message array
    const filteredMessage = message.filter((msg) => msg.role !== 'system');

    try {
      const stream = await this.openai.chat.completions.create({
        model: process.env.OPEN_AI_MODEL as string,
        messages: [
          {
            role: 'system',
            content: basePrompt,
          },
          // @ts-ignore
          ...filteredMessage,
        ],
        stream: true,
        max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
        temperature: parseFloat(process.env.OPEN_AI_TEMP),
        top_p: 1,
      });

      for await (const chunk of stream) {
        if (chunk.choices[0].delta.content === 'undefined') continue;

        this.streamService.handleMessage(
          userID,
          chunk.choices[0].delta.content as string,
          chatID,
          Tools.MOCK_INTERVIEW_PREP,
        );

        content += (chunk.choices[0].delta.content as string) || '';
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    const { user } = await this.updateToolCountAndUserMessageCount(
      Tools.MOCK_INTERVIEW_PREP,
      userID,
    );

    return {
      content: content.replace('undefined', '').trim(),
      basePrompt,
      user,
    };
  }

  // =================== 5. Skills Gap Analysis ======================
  /**
   * @description This endpoint processes a user profile and generates a skills gap analysis response using OpenAI's chat completions.
   * @param {string} userID - The unique identifier for the user.
   * @param {ISkillsGapAnalysis} skillsGapAnalysisData - The input data containing message and prompt details for the skills gap analysis.
   * @returns {Promise<{content: string}>} A Promise that resolves to the skills gap analysis response as a string.
   */
  async skillsGapAnalysis(
    chatID: string,
    userID: string,
    { message, promptDetails }: ISkillsGapAnalysis,
  ): Promise<{ content: string; basePrompt: string; user: IUser }> {
    // Function level variables
    let content: string;

    await this.checkAndUpdateMessageLimit(userID);

    const basePrompt = basePrompt_SGA(promptDetails);

    // filter our role === system messages from the message array
    const filteredMessage = message.filter((msg) => msg.role !== 'system');

    try {
      const stream = await this.openai.chat.completions.create({
        model: process.env.OPEN_AI_MODEL as string,
        messages: [
          {
            role: 'system',
            content: basePrompt,
          },
          // @ts-ignore
          ...filteredMessage,
        ],
        stream: true,
        max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
        temperature: parseFloat(process.env.OPEN_AI_TEMP),
        top_p: 1,
      });

      for await (const chunk of stream) {
        const responseContent = chunk.choices[0].delta.content as string;

        if (
          !responseContent ||
          responseContent.toLowerCase().includes('undefined')
        ) {
          continue;
        }

        this.streamService.handleMessage(
          userID,
          responseContent,
          chatID,
          Tools.SKILLS_GAP_ANALYSIS,
        );

        content += responseContent || '';
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    const { user } = await this.updateToolCountAndUserMessageCount(
      Tools.SKILLS_GAP_ANALYSIS,
      userID,
    );

    return {
      content: content.replace('undefined', '').trim(),
      basePrompt,
      user,
    };
  }
  // =================== Recommend Industry ======================
  /**
   * @description This endpoint takes in a user profile and returns normalized CV data using OPEN AI Assistant tool knowledge retrieval.
   * @param file
   * @returns Normalized CV JSON.
   */
  async recommendIndustry(
    userID: string,
  ): Promise<{ recommendations: string }> {
    const {
      age,
      fullName,
      branchOfService,
      languages,
      education,
      certificates,
      workExperience,
    } = await this.userModel.findById(userID);

    const basePrompt = basePrompt_RI({
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
        model: process.env.OPEN_AI_MODEL as string,
        messages: [{ role: 'system', content: basePrompt }],
        max_tokens: parseFloat(process.env.OPEN_AI_MAX_TOKENS),
        temperature: parseFloat(process.env.OPEN_AI_TEMP),
        top_p: 1,
      });

      return { recommendations: response.choices[0].message.content };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // =================== Parse CV - File Upload ======================
  /**
   * Utilizes OpenAI's assistant API to analyze and extract structured information
   * from an uploaded Curriculum Vitae (CV) file.
   *
   * @param {Buffer} file - The binary data of the uploaded CV file.
   * @returns {Promise<string>} - A string representation of the parsed CV fields.
   * @throws {HttpException} - Throws an HTTP exception in case of errors, with
   * the error message and status code appropriately set.
   */
  async parseCV(file: Buffer): Promise<string> {
    try {
      console.time('Time in seconds to parse and normalize user resume');

      const fileBuffer = Buffer.from(file.buffer);

      // Create a file on OpenAI
      const uploadedFile = await this.createOpenAIFile(fileBuffer);

      // Retrieve assistant information from OpenAI
      const assistant = await this.openai.beta.assistants.retrieve(
        'asst_zVuBcl71594b5ulGFJhmoHEJ',
      );

      console.log('Assistant Retrieved');

      // Create a new thread on OpenAI
      const thread = await this.openai.beta.threads.create();

      console.log('Thread Retrieved');

      // Create a message on the thread
      await this.createOpenAIMessage(thread.id, uploadedFile.id);

      console.log('Message Created');

      // Create a run on the thread
      const run = await this.openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });

      console.log('Steps Queued...');

      // Polling mechanism to check if run is completed
      await this.waitForRunCompletion(thread.id, run.id);

      // Retrieve messages from the thread
      const messages = await this.openai.beta.threads.messages.list(thread.id);

      console.log('Messages Retrieved');

      console.timeEnd('Time in seconds to parse and normalize user resume');

      const resp: any = messages.data[0].content[0];

      // Extract the JSON response from the message
      const jsonResponse = resp.text.value
        .replace(/^`{3}\s*JSON\s*/i, '')
        .replace(/`{3}\s*$/i, '');

      return jsonResponse;
    } catch (error) {
      // Handle errors and throw appropriate exceptions
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Create an OpenAI file using the provided file buffer
   * @param {Buffer} file - The uploaded CV file
   * @returns {Promise<any>} - OpenAI file object
   */
  private async createOpenAIFile(file: any): Promise<any> {
    // Create an OpenAI file using the provided file buffer
    return await this.openai.files.create({
      file: await toFile(file, file.originalname), // Use a meaningful name for the file
      purpose: 'assistants',
    });
  }

  /**
   * Create a message on the specified OpenAI thread
   * @param {string} threadId - The ID of the OpenAI thread
   * @param {string} fileId - The ID of the OpenAI file
   * @returns {Promise<any>} - OpenAI message object
   */
  private async createOpenAIMessage(
    threadId: string,
    fileId: string,
  ): Promise<any> {
    // Create a message on the specified thread
    return await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: ResumeParserBasePrompt,
      file_ids: [fileId],
    });
  }

  /**
   * Poll and wait for the completion of an OpenAI run
   * @param {string} threadId - The ID of the OpenAI thread
   * @param {string} runId - The ID of the OpenAI run
   * @returns {Promise<void>}
   */
  private async waitForRunCompletion(
    threadId: string,
    runId: string,
  ): Promise<void> {
    const maxAttempts = 100; // Maximum number of attempts to check the run status
    const pollInterval = 2000; // Time interval between status checks in milliseconds

    let attempts = 0;

    while (attempts < maxAttempts) {
      // Polling mechanism to check if the run is completed
      const runStatus = await this.openai.beta.threads.runs.retrieve(
        threadId,
        runId,
      );

      console.log(
        'RUN 6',
        { runStatus: runStatus.status },
        runStatus.started_at,
      );

      console.log('attempts', attempts);

      switch (runStatus.status) {
        case 'completed':
          console.log('Completed', runStatus.completed_at);
          return; // Run has completed successfully
        case 'failed':
        case 'cancelled':
        case 'expired':
          console.log('Failed', runStatus);
          throw new Error(`Run failed with status: ${runStatus.status}`);
        default:
          // Continue polling for completion
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
          attempts++;
      }
    }

    // If the loop reaches here, the maximum attempts have been reached
    throw new Error('Timeout: Run did not complete within the expected time');
  }
}
