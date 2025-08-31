// Nest JS Imports
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Delete,
  Request,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

// Services Imports
import { ChatsService } from './chat.service';

// Guard Imports
import { JwtAuthGuard } from 'src/Guard/jwt.guard';

// Schema Imports
import { UserDocument } from 'src/schemas/users/user.schema';

// DTO Imports
import { SaveChatDto } from './DTO/saveChat.dto';

// Interfaces Imports
import { ExtendedRequest } from 'src/utils/Templates/extented-request.interface';
import { IChats } from './Interfaces/chats.interface';

// Enum Imports
import { Tools } from 'src/types/enums/tools.enum';

@ApiTags('Chats')
@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) { }

//#region : CHATS CRUD

  // =================== POST: SAVE CHAT ======================
  /**
   * @description This endpoint takes in chat messages and saves them to the database.
   * @body {SaveChatDto} chat
   * @returns Promise<{ message: string }> Returns a Promise that resolves to string.
   */
  @Post('/save-chat')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async saveChat(
    @Body() chat: SaveChatDto,
    @Request() req: { user: UserDocument },
  ): Promise<{ message: string }> {
    const { user } = req;
    return await this.chatsService.saveChat(chat, user.id);
  }

  // =================== GET: GET CHAT  BY ID ======================
  /**
   * @description This endpoint takes in chat id and returns that chat.
   * @body {string} chat_id
   * @returns {Promise<IChats>} A Promise that resolves to an object of chat.
   */
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async chatById(
    @Param('id') chat_id: string,
    @Req() req: ExtendedRequest,
  ): Promise<{ chat: IChats } | void> {
    const { user } = req;
    return await this.chatsService.getChatById(user.id, chat_id);
  }

  // =================== GET: GET CHAT  BY SLUG ======================
  /**
   * @description This endpoint takes in slug and returns those chats.
   * @body {Tools} slug
   * @returns {Promise<{chats: IChats[]} | void>} A Promise that resolves to an array of object of chat.
   */
  @Get('/bySlug/slug')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @ApiQuery({
    name: 'slug',
    enum: Tools,
    required: true,
  })
  async chatBySlug(
    @Query('slug') slug: Tools,
    // @Param('slug') slug: Tools,
    @Req() req: ExtendedRequest,
  ): Promise<{ chats: IChats[] } | void> {
    const { user } = req;
    return await this.chatsService.getChatBySlug(user.id, slug);
  }

  // =================== DELETE: DELETE CHAT  BY ID ======================
  /**
   * @description This endpoint takes in chat id and returns that success msg.
   * @body {string} chat_id
   * @returns {Promise<{message: string}>} A Promise that resolves to a string.
   */
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async deleteChatById(
    @Param('id') chat_id: string,
    @Req() req: ExtendedRequest,
  ): Promise<{ message: string }> {
    const { user } = req;
    return await this.chatsService.deleteChatById(user.id, chat_id);
  }

//#endregion

}
