// Nest JS Imports
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Types, Schema & DTO Imports
import { Chat, ChatDocument } from 'src/schemas/chats/chats.schema';
import { User, UserDocument } from 'src/schemas/users/user.schema';

// Mongoose Imports
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// DTO Imports
import { SaveChatDto } from './DTO/saveChat.dto';

// Interfaces Imports
import { IChats } from './Interfaces/chats.interface';

// Enum Imports
import { Tools } from 'src/types/enums/tools.enum';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

//#region : CHATS CRUD

  /**
   * @description Saves chat messages to the database.
   * @param {ISaveChat} chat - The chat messages to be saved.
   * @param {string} userID - The unique identifier for the user.
   * @returns {Promise<{ message: string }>} A Promise that resolves to a success message upon saving the chat.
   */
  async saveChat(
    chat: SaveChatDto,
    userID: string,
  ): Promise<{ message: string }> {
    try {
      if (chat.chatID) {
        await this.chatModel.findByIdAndUpdate({ _id: chat.chatID }, chat, {
          new: true,
        });

        return {
          message: 'Chat updated successfully.',
        };
      }
      const newChat = new this.chatModel({
        ...chat,
        userID: userID,
      });

      await newChat.save();

      return {
        message: 'Chat saved successfully.',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description To Get the user chat by id.
   * @param  {string} user_id
   * @param  {string} chat_id
   * @returns  {Promise<IChats>} A Promise that resolves to an object of chat.
   */

  async getChatById(
    user_id: string,
    chat_id: string,
  ): Promise<{ chat: IChats } | void> {
    try {
      const userExist = await this.userModel.findById(user_id);
      if (!userExist) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const chatById = await this.chatModel.findById(chat_id);
      if (!chatById) {
        throw new HttpException('Chat by id not found', HttpStatus.NOT_FOUND);
      }
      return {
        chat: chatById,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description To Get the user chat by slug.
   * @param  {string} user_id
   * @param  {Tools} slug
   * @returns  {Promise<{chats: IChats[]} | void>} A Promise that resolves to an object of chat.
   */

  async getChatBySlug(
    user_id: string,
    slug: Tools,
  ): Promise<{ chats: IChats[] } | void> {
    try {
      const userExist = await this.userModel.findById(user_id);
      if (!userExist) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const chatBySlug = await this.chatModel.find({
        userID: user_id,
        toolName: slug,
      });
      if (chatBySlug.length === 0) {
        throw new HttpException('Chat by slug not found', HttpStatus.NOT_FOUND);
      }
      return {
        chats: chatBySlug,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description To delete the user chat by id.
   * @param  {string} user_id
   * @param  {string} chat_id
   * @returns  {Promise<{message: string}>} A Promise that resolves to a string.
   */

  async deleteChatById(
    user_id: string,
    chat_id: string,
  ): Promise<{ message: string }> {
    try {
      const userExist = await this.userModel.findById(user_id);
      if (!userExist) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const chatById = await this.chatModel.findByIdAndDelete(chat_id);
      if (!chatById) {
        throw new HttpException('Chat by Id not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Chat by Id is deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

//#endregion

}
