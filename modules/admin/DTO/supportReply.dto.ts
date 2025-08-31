// Class Validator imports
import { Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class SupportReplyDTO {

    @IsNotEmpty()
    @IsString()
    @Expose()
    supportId: string = '653f899fa99c72f32303a2f0';

    @IsNotEmpty()
    @IsString()
    @Expose()
    reply: string = 'This is openAI tool that will help you';
}