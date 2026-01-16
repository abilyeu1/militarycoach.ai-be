import { OPENAI_ROLES, Tools } from 'src/types/enums/tools.enum';
export declare class ConversationDto {
    role: OPENAI_ROLES;
    content: string;
}
export declare class SaveChatDto {
    chatID: string;
    toolName: Tools;
    conversation: ConversationDto[];
}
