import { ChatsService } from './chat.service';
import { UserDocument } from 'src/schemas/users/user.schema';
import { SaveChatDto } from './DTO/saveChat.dto';
import { ExtendedRequest } from 'src/utils/Templates/extented-request.interface';
import { IChats } from './Interfaces/chats.interface';
import { Tools } from 'src/types/enums/tools.enum';
export declare class ChatsController {
    private chatsService;
    constructor(chatsService: ChatsService);
    saveChat(chat: SaveChatDto, req: {
        user: UserDocument;
    }): Promise<{
        message: string;
    }>;
    chatById(chat_id: string, req: ExtendedRequest): Promise<{
        chat: IChats;
    } | void>;
    chatBySlug(slug: Tools, req: ExtendedRequest): Promise<{
        chats: IChats[];
    } | void>;
    deleteChatById(chat_id: string, req: ExtendedRequest): Promise<{
        message: string;
    }>;
}
