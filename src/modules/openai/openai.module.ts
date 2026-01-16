// Nest Js Imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Controller Imports
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';

// Schemas Imports
import { User, UserSchema } from 'src/schemas/users/user.schema';
import { Tool, ToolSchema } from 'src/schemas/tools/tools.schema';

// Gateway Imports
import { StreamGateway } from 'src/stream.gateway';
import { Chat, ChatSchema } from 'src/schemas/chats/chats.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tool.name, schema: ToolSchema },
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  controllers: [OpenaiController],
  providers: [OpenaiService, ConfigService, StreamGateway],
  exports: [OpenaiService],
})
export class OpenaiModule {}
