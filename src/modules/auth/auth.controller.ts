// Nest JS Imports
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Service imports
import { AuthService } from './auth.service';

// DTO & type imports
import { AuthDTO } from './DTO/auth.dto';
import { RegisterUserDto } from './DTO/registerUser.dto';
import { resetPasswordDto } from './DTO/resetPassword.dto';
import { newPassDto } from './DTO/newPassword.dto';

// Interfaces Imports
import IUser from '../users/interface/user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //#region : LOGIN AND SIGN UP

  // =================== POST: User Login ======================
  /**
   * Logs in a user and returns a JWT token.
   * @param {AuthDTO} authData - The user's email address and password.
   * @returns {Promise<IUser>} Returns a Promise that resolves to a User object.
   */
  @Post('/login')
  @UsePipes(ValidationPipe)
  async logIn(
    @Body() authData: AuthDTO,
  ): Promise<{ user: IUser; token: string }> {
    return await this.authService.login(authData);
  }

  // =================== POST: User Registration ======================
  /**
   * Registers a new user and creates a Stripe customer account for the user.
   * @Body {RegisterUserDto} user - The user object containing user registration details.
   * @returns {Promise<IUser>} Returns a Promise that resolves to a User object.
   */
  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(
    @Body() user: RegisterUserDto,
  ): Promise<{ user: IUser; token: string }> {
    return await this.authService.register(user);
  }

  //#endregion

  //#region : FORGET PASS FLOW

  // =================== POST: Request Reset Password ======================
  /**
   * Requests reset pass and returns otp on email.
   * @Body {resetPasswordDTO} resetPasswordDTO - The user's email address.
   * @returns {Promise<{message: string}>} Returns a Promise that resolves to a string.
   */
  @Post('/requestResetPassword')
  @UsePipes(ValidationPipe)
  async requestResetPassword(
    @Body() reqBody: resetPasswordDto,
  ): Promise<{ message: string }> {
    return await this.authService.requestResetPassword(reqBody);
  }

  // =================== POST: Reset New Pass ======================
  /**
   * New Pass and token will send and returns success message.
   * @Body {newPassDto} newPass - The otp, password to be set and email.
   * @returns {Promise<{message: string}>} Returns a Promise that resolves to a string.
   */
  @Post('/resetPassword')
  @UsePipes(ValidationPipe)
  async resetPassword(
    @Body() reqBody: newPassDto,
  ): Promise<{ message: string }> {
    return await this.authService.resetPass(reqBody);
  }

  //#endregion
}
