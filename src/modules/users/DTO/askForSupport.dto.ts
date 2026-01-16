// Class Validator imports
import { Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class AskForSupportDTO {

    @IsNotEmpty()
    @IsString()
    @Expose()
    question: string = 'Tell me about this career-wizard tool?';
}