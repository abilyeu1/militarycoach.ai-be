// Nest JS Imports
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

// MongoDB Imports
import { Model } from 'mongoose';

// Types & DTO Imports
import IUser from '../users/interface/user.interface';
import { AuthDTO } from './DTO/auth.dto';
import { RegisterUserDto } from './DTO/registerUser.dto';
import {
  AUTH_ROLES,
  SHEER_ID_STATUS,
  UserTypes,
} from 'src/types/enums/user.enum';
import { newPassDto } from './DTO/newPassword.dto';
import { resetPasswordDto } from './DTO/resetPassword.dto';

// Schema Imports
import { User, UserDocument } from 'src/schemas/users/user.schema';
import { Otp, OtpDocument } from 'src/schemas/otp/otp.schema';

// Util Imports
import { comparePassword, hashPassword } from 'src/utils/bycrpt';

// Service Imports
import { StripeService } from '../stripe/stripe.service';

// NPM Package Imports
import Stripe from 'stripe';
import axios from 'axios';

// Util Imports
import * as moment from 'moment';
import { getHoursLeft } from 'src/utils/getHours';
import { generateOtpCode } from 'src/utils/OTP/otpGenerator';
import { vacuaEmail } from 'src/utils/Templates/emailConstants';
import { transporter } from 'src/utils/Email/sendEmail';

// Interfaces Imports
import { IOtp } from './interfaces/otp.interface';
import { IAuthPayload } from './interfaces/authPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private stripeService: StripeService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private OtpModel: Model<OtpDocument>,
  ) {}

  //#region : LOGIN AND SIGN UP

  // =================== POST: User Login ======================
  /**
   * Logs in a user and returns a JWT token.
   * @param {AuthDTO} user - The user's email address and password.
   * @returns {Promise<IUser>} Returns a Promise that resolves to a User object.
   */
  async login(user: AuthDTO): Promise<{ user: IUser; token: string }> {
    try {
      const userExist = await this.userModel.findOne({ email: user.email });

      if (!userExist) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = await comparePassword(
        user.password,
        userExist.password,
      );

      if (!isPasswordValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const hoursConsumed = getHoursLeft(userExist.createdAt);

      if (Number(hoursConsumed) >= userExist.freeUserHoursLimit) {
        await this.userModel.findByIdAndUpdate(userExist._id, {
          freeMessagesLimitExhausted: true,
        });
      }

      const areFieldsEmpty =
        !userExist.industryOfInterest ||
        !userExist.jobPositionOfInterest ||
        !userExist.jobPositionLevel ||
        !userExist.education ||
        !userExist.certificates ||
        userExist.education.length === 0 ||
        userExist.certificates.length === 0;

      // Update the profileStatus
      const updateData = {
        profileStatus: areFieldsEmpty ? 'incomplete' : 'complete',
      };

      // After updating the profileStatus, fetch the updated user.
      const updatedUser: IUser = await this.userModel.findOneAndUpdate(
        { email: user.email },
        updateData,
        { new: true, upsert: true },
      );

      const authPayload: IAuthPayload = {
        email: updatedUser.email,
        id: updatedUser._id.toString(),
        type: updatedUser.type,
        role: AUTH_ROLES.USER,
      };

      const token = this.jwtService.sign(authPayload);

      return {
        user: updatedUser,
        token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== POST: User Registration ======================
  /**
   * Registers a new user and creates a Stripe customer account for the user.
   * @args User - The user object containing user registration details.
   * @returns {Promise<IUser>} Returns a Promise that resolves to a User object.
   */
  async register(
    userDocument: RegisterUserDto,
  ): Promise<{ user: IUser; token: string }> {
    try {
      // check if user already exist
      const isEmailExist = await this.userModel.findOne({
        email: userDocument.email,
      });

      // if user exist throw error
      if (isEmailExist) {
        throw new HttpException('User Already Exist', HttpStatus.CONFLICT);
      }

      // hash user password
      const saltedPassword = await hashPassword(userDocument.password);

      // create new user document in database
      const newUser = new this.userModel({
        // User Details from request body
        ...userDocument,

        // Salted password
        password: saltedPassword,

        // Default values for new users
        createdAt: new Date(),
        stripeSubscriptionId: null,
        stripeSubscriptionStatus: 'free',
        freeUserHoursLimit: 72, // 3 days free trial
        messagesLimit: 12,
        messagesConsumed: 0,
        freeMessagesLimitExhausted: false,
        profileStatus: null,
      });

      // save user document in database and return saved user
      const savedUser = await newUser.save();

      // create auth payload for JWT token.
      const authPayload: IAuthPayload = {
        email: savedUser.email,
        id: savedUser._id.toString(),
        type: savedUser.type,
        role: AUTH_ROLES.USER,
      };

      if (!savedUser)
        throw new HttpException(
          'User not saved',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      const token = await this.jwtService.sign(authPayload);

      if (!token)
        throw new HttpException(
          'Token not generated',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      // create stripe customer account for user and update user document with stripe customer id
      // const stripeCustomer: Stripe.Customer =
      //   await this.stripeService.createCustomer({
      //     email: savedUser.email.toLowerCase(),
      //     name: `${savedUser.fullName}`,
      //   });

      // if (!stripeCustomer)
      //   throw new HttpException(
      //     'Stripe customer not created',
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );

      const user: IUser = await this.userModel.findByIdAndUpdate(
        savedUser._id,
        {
          // Default values for new users
          stripeCustomerId: null,
        },
        { new: true, upsert: true },
      );

      return {
        user,
        token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : FORGET PASS FLOW

  // =================== POST: Reset Password ======================
  /**
   * Requests reset pass and returns otp on email.
   * @param {resetPasswordDTO} resetPasswordDTO - The user's email address.
   * @returns {Promise<{message: string}>} Returns a Promise that resolves to a string.
   */
  async requestResetPassword(
    resetPasswordDTO: resetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      let otpCode: any;
      let currTime = new Date();

      let expiryTime = moment().add(15, 'minutes').format();
      const isUserExist = await this.userModel.findOne({
        email: resetPasswordDTO.email,
      });
      if (!isUserExist) {
        throw new HttpException(
          'User not found with this email.',
          HttpStatus.NOT_FOUND,
        );
      }
      const otpAlreadyExist = await this.OtpModel.findOne({
        email: resetPasswordDTO.email,
      });
      if (otpAlreadyExist) {
        if (otpAlreadyExist.expiry > currTime) {
          otpCode = otpAlreadyExist.code;
        } else {
          otpCode = generateOtpCode(6);
        }
      } else {
        otpCode = generateOtpCode(6);
      }
      var mailOptions = {
        from: vacuaEmail,
        to: isUserExist.email,
        subject: 'OTP CHANGED',
        html: `<h1>Your code is ${otpCode}</h1>`,
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('Error transporter email', error);
        } else {
          const insertForgotPassData: IOtp = {
            email: isUserExist.email,
            code: otpCode,
            expiry: expiryTime,
          };
          if (otpAlreadyExist) {
            const getInsertedRes = await this.OtpModel.findByIdAndUpdate(
              otpAlreadyExist._id,
              insertForgotPassData,
            );
          } else {
            const insertedRes = new this.OtpModel(insertForgotPassData);
            const getInsertedRes = await insertedRes.save();
          }
        }
      });
      return {
        message: 'Otp has been sent to your email successfully!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== POST: Reset New Pass ======================
  /**
   * New Pass and token will send and returns success message.
   * @param {newPassDto} newPass - The otp, password to be set and email.
   * @returns {Promise<{message: string}>} Returns a Promise that resolves to a string.
   */
  async resetPass(newPass: newPassDto): Promise<{ message: string }> {
    try {
      let currTime = new Date();
      const otp = await this.OtpModel.findOne({
        code: newPass.code,
      });
      if (!otp) {
        throw new HttpException('Invalid OTP code', HttpStatus.NOT_FOUND);
      }
      if (currTime > otp.expiry) {
        await this.OtpModel.deleteOne({ _id: otp._id });
        throw new HttpException(
          'OTP code expired. Please generate new!',
          HttpStatus.NOT_FOUND,
        );
      }

      const user = await this.userModel.findOne({
        email: newPass.email,
      });
      if (!user) {
        throw new HttpException(
          'User with this email not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const isSameNewPass = await comparePassword(
        newPass.password,
        user.password,
      );
      if (isSameNewPass) {
        throw new HttpException(
          'Cannot set this password',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const decodedPass = await hashPassword(newPass.password);
      user.password = decodedPass;
      const updatedUser = new this.userModel(user);
      await updatedUser.save();
      await this.OtpModel.deleteOne({
        email: newPass.email,
      });
      return {
        message:
          'Password has been changed successfully. Redirecting to Login Page',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion
}
