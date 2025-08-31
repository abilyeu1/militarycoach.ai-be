
import {
    Prop,
    Schema,
    SchemaFactory
  } from '@nestjs/mongoose';
import { IsDate } from 'class-validator';
import { Document, HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;
  
@Schema()
export class Otp {
    @Prop({ 
        required: true, 
        unique: true
    })
    email: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    expiry: Date;

    @IsDate()
    @Prop({ default: Date.now })
    createdAt: Date;
  
    @IsDate()
    @Prop({ default: Date.now })
    updatedAt: Date;
}
  
export const OtpSchema = SchemaFactory.createForClass(Otp);
