/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Tools } from 'src/types/enums/tools.enum';
import { Chat } from 'src/schemas/chats/chats.schema';
import { Tool } from 'src/schemas/tools/tools.schema';
import { UserDocument } from 'src/schemas/users/user.schema';
import IUser from '../users/interface/user.interface';
import { ICareerWizard } from './interface/careerWizard.interface';
import { IChat } from './interface/chat.type';
import { ICoverLetterWizard } from './interface/coverLetterWizard.interface';
import { IMockInterview } from './interface/mockInterview.interface';
import { ISkillsGapAnalysis } from './interface/skillsGapAnalysis.interface';
import { StreamGateway } from 'src/stream.gateway';
export declare class OpenaiService {
    private configService;
    private userModel;
    private toolModel;
    private chatModel;
    private streamService;
    private openai;
    constructor(configService: ConfigService, userModel: Model<UserDocument>, toolModel: Model<Tool>, chatModel: Model<Chat>, streamService: StreamGateway);
    fetchConversation(userID: string, toolName: Tools, chatID?: string): Promise<{
        conversation: IChat;
        id: string | null;
    }>;
    checkAndUpdateMessageLimit(userID: string): Promise<void>;
    updateToolCountAndUserMessageCount(toolName: Tools, userID: string): Promise<{
        user: IUser;
    }>;
    bulletTranslator(userID: string, bullet: string): Promise<{
        message: string;
        user: IUser;
    }>;
    careerWizard(chatID: string, userID: string, { message, promptDetails }: ICareerWizard): Promise<{
        content: string;
        basePrompt: string;
        user: IUser;
    }>;
    coverLetterWizard(userID: string, promptDetails: ICoverLetterWizard): Promise<{
        content: string;
        user: IUser;
    }>;
    mockInterview(chatID: string, userID: string, { message, promptDetails }: IMockInterview): Promise<{
        content: string;
        basePrompt: string;
        user: IUser;
    }>;
    skillsGapAnalysis(chatID: string, userID: string, { message, promptDetails }: ISkillsGapAnalysis): Promise<{
        content: string;
        basePrompt: string;
        user: IUser;
    }>;
    recommendIndustry(userID: string): Promise<{
        recommendations: string;
    }>;
    parseCV(file: Buffer): Promise<string>;
    private createOpenAIFile;
    private createOpenAIMessage;
    private waitForRunCompletion;
}
