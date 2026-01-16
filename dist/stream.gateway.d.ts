import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { Tools } from './types/enums/tools.enum';
export declare class StreamGateway implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    handleMessage(userID: string, message: string, chatID: string | null, toolName?: Tools): void;
}
