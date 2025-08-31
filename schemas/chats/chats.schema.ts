// Nest JS imports
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Mongoose imports
import { HydratedDocument } from 'mongoose';

// Class Validator imports
import { IsDate, IsEnum, IsString } from 'class-validator';

// Enum imports
import { OPENAI_ROLES, Tools } from 'src/types/enums/tools.enum';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ required: true })
  @IsString()
  userID: string;

  // @Prop({ required: true })
  // @IsEnum(Tools)
  // slugs: Tools;

  @Prop({ required: true })
  @IsEnum(Tools)
  toolName: Tools;

  @IsDate()
  @Prop({ default: Date.now })
  createdAt: Date;

  @IsString()
  @Prop({ required: true })
  conversation: {
    role: OPENAI_ROLES;
    content: string;
  }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
