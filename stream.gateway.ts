// NestJS Imports
import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

// Socket.io imports
import { Server } from 'socket.io';

// Types imports
import { Tools } from './types/enums/tools.enum';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:8000/socket.io',
      'https://app.militarycoach.ai/',
      'https://staging.militarycoach.ai/',
      'https://milcoach.vercel.app/',
      'https://api.militarycoach.ai/',
    ],
    methods: ['GET', 'POST'],
  },
})
export class StreamGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected');
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody()
    userID: string,
    message: string,
    chatID: string | null,
    toolName?: Tools,
  ): void {
    if (toolName && !chatID) {
      this.server.emit(`${userID}_${toolName}`, message);
      return;
    } else {
      this.server.emit(`${userID}_${chatID}`, message);
      return;
    }
  }
}
