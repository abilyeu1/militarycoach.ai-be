// Nest JS imports
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Mongoose imports
import { HydratedDocument } from 'mongoose';

// Class Validator imports
import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export type ToolDocument = HydratedDocument<Tool>;

@Schema()
export class Tool {
  @Prop({ required: true })
  @IsString()
  name: string;

  @IsDate()
  @Prop({ default: Date.now })
  createdAt: Date;

  @IsString()
  @Prop({ required: true })
  basePrompt: string;

  @IsNumber()
  @Prop({ required: true })
  noOfTimeUsed: number;
}

export const ToolSchema = SchemaFactory.createForClass(Tool);
