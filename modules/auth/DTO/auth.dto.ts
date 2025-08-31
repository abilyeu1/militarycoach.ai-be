import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string = 'aliraza@gmail.com';

  @IsNotEmpty()
  @IsString()
  password: string = '123123';
}
