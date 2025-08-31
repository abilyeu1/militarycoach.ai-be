// NestJS imports
import {
    IsDate,
    IsString,
    IsArray,
    ValidateNested,
    IsIn,
    IsNotEmpty,
    IsEnum,
  } from 'class-validator';
  import { Expose, Type } from 'class-transformer';
  
  // Enum Imports
  import { OPENAI_ROLES, Tools } from 'src/types/enums/tools.enum';
  
  export class AddFavDto {
    
    @IsNotEmpty()
    @IsEnum(Tools)
    @Expose()
    toolName: Tools = Tools.BULLET_TRANSLATOR;

    @IsNotEmpty()
    @IsString()
    @Expose()
    bullet: string = "Roger that";

    @IsNotEmpty()
    @IsString()
    @Expose()
    translation: string = "An ackowledgment to indicate understanding or agreement";
  }
  