// Nest Js Imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Controller Imports
import { FavouriteController } from './favourite.controller';

// Schemas Imports
import { Chat, ChatSchema } from 'src/schemas/chats/chats.schema';
import { User, UserSchema } from 'src/schemas/users/user.schema';

// Gateway Imports
import { StreamGateway } from 'src/stream.gateway';
import { FavouriteService } from './favourite.service';
import { Favourite, FavouriteSchema } from 'src/schemas/favourites/favourites.schema';
import { Tool, ToolSchema } from 'src/schemas/tools/tools.schema';

// Service Imports

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Favourite.name, schema: FavouriteSchema },
      { name: User.name, schema: UserSchema },
      { name: Tool.name, schema: ToolSchema },
    ]),
  ],
  controllers: [FavouriteController],
  providers: [FavouriteService, ConfigService, StreamGateway],
  exports: [FavouriteService],
})
export class FavouriteModule {}
