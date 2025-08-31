import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class newPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  token: string = 'jkcncjkn...';

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Expose()
  password: string = '5uifbuif';
}
