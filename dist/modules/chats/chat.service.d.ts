import { ChatDocument } from 'src/schemas/chats/chats.schema';
import { UserDocument } from 'src/schemas/users/user.schema';
import { Model } from 'mongoose';
import { SaveChatDto } from './DTO/saveChat.dto';
import { IChats } from './Interfaces/chats.interface';
import { Tools } from 'src/types/enums/tools.enum';
export declare class ChatsService {
    private chatModel;
    private userModel;
    constructor(chatModel: Model<ChatDocument>, userModel: Model<UserDocument>);
    saveChat(chat: SaveChatDto, userID: string): Promise<{
        message: string;
    }>;
    getChatById(user_id: string, chat_id: string): Promise<{
        chat: IChats;
    } | void>;
    getChatBySlug(user_id: string, slug: Tools): Promise<{
        chats: IChats[];
    } | void>;
    deleteChatById(user_id: string, chat_id: string): Promise<{
        message: string;
    }>;
}
