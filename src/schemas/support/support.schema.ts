
import {
    Prop,
    Schema,
    SchemaFactory
  } from '@nestjs/mongoose';
import { IsDate } from 'class-validator';
import { Document, HydratedDocument } from 'mongoose';
import { SupportStatus } from 'src/types/enums/common.enum';

export type SupportDocument = HydratedDocument<Support>;
  
@Schema()
export class Support {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    question: string;

    @Prop({ required: false, default: "" })
    reply: string;

    @Prop({ required: false, default: SupportStatus.UNRESOLVED })
    status: SupportStatus;

    @IsDate()
    @Prop({ default: Date.now })
    createdAt: Date;
  
    @IsDate()
    @Prop({ default: Date.now })
    updatedAt: Date;
}
  
export const SupportSchema = SchemaFactory.createForClass(Support);
