// Nest Js Imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Controller Imports
import { ChatsController } from './chat.controller';

// Schemas Imports
import { Chat, ChatSchema } from 'src/schemas/chats/chats.schema';
import { User, UserSchema } from 'src/schemas/users/user.schema';

// Gateway Imports
import { StreamGateway } from 'src/stream.gateway';

// Service Imports
import { ChatsService } from './chat.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ConfigService, StreamGateway],
  exports: [ChatsService],
})
export class ChatsModule {}
