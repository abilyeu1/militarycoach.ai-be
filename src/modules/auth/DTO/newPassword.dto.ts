import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class newPassDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  email: string = 'ali@gmail.com';

  @IsNotEmpty()
  @IsNumberString()
  code: string = '583459';

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Expose()
  password: string = 'new_password';
}
