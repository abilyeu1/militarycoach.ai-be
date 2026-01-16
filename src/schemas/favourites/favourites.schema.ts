// Nest JS imports
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Mongoose imports
import { HydratedDocument, trusted } from 'mongoose';

// Class Validator imports
import { IsDate, IsEnum, IsString } from 'class-validator';
import { Tools } from 'src/types/enums/tools.enum';


export type FavouriteDocument = HydratedDocument<Favourite>;

@Schema()
export class Favourite {
  @Prop({ required: true })
  @IsString()
  userID: string;

  @Prop({ required: true })
  @IsEnum(Tools)
  toolName: Tools;

  @Prop({ required: true })
  @IsString()
  bullet: string;

  @Prop({ required: true })
  @IsString()
  translation: string;

  @Prop({ required: true, default: true })
  @IsString()
  status: boolean;

  @IsDate()
  @Prop({ default: Date.now })
  createdAt: Date;

  @IsDate()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);
