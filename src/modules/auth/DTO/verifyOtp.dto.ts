import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class verifyOtpDto {
    @IsNotEmpty()
    @IsNumberString()
    @Expose()
    code: string = '4567';
}