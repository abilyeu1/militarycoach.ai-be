import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminAuthDTO {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string = 'mjawwadzenkoders@gmail.com';

  @IsNotEmpty()
  @IsString()
  @Expose()
  password: string = '123456';
}
