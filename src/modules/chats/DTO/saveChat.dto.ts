// NestJS imports
import {
  IsDate,
  IsString,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

// Enum Imports
import { OPENAI_ROLES, Tools } from 'src/types/enums/tools.enum';

export class ConversationDto {
  @IsString()
  role: OPENAI_ROLES;

  @IsString()
  content: string;
}

export class SaveChatDto {
  chatID: string;

  @IsString()
  @Expose()
  toolName: Tools = Tools.CAREER_WIZARD;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConversationDto)
  @Expose()
  conversation: ConversationDto[];
}
