// Nest JS Imports
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Types, Schema & DTO Imports
import { Otp, OtpDocument } from 'src/schemas/otp/otp.schema';
import { Support, SupportDocument } from 'src/schemas/support/support.schema';
import { Tool, ToolDocument } from 'src/schemas/tools/tools.schema';
import { User, UserDocument } from 'src/schemas/users/user.schema';

// Mongoose Imports
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Stripe Imports
import Stripe from 'stripe';

// Service Imports
import { JwtService } from '@nestjs/jwt';
import { StripeService } from '../stripe/stripe.service';

// DTO Imports
import { RegisterUserDto } from '../auth/DTO/registerUser.dto';
import { resetPasswordDto } from '../auth/DTO/resetPassword.dto';
import { verifyOtpDto } from '../auth/DTO/verifyOtp.dto';
import { UpdateUserProfileDto } from '../users/DTO/updateUserProfile.dto';
import { addProductDTO } from './DTO/addProduct.dto';
import { AdminAuthDTO } from './DTO/adminAuth.dto';
import { newPasswordDTO } from './DTO/newPassword.dto';
import { SupportReplyDTO } from './DTO/supportReply.dto';
import { updateProductDTO } from './DTO/updateProduct.dto';

// Interfaces Imports
import { IAuthPayload } from '../auth/interfaces/authPayload.interface';
import { IOtp } from '../auth/interfaces/otp.interface';
import ISupport from '../users/interface/support.interface';
import IUser from '../users/interface/user.interface';
import { ISupportQuery } from './Interfaces/allSupportQuery.interface';
import { IQuery } from './Interfaces/allUsersQuery.interface';

// Enum Imports
import {
  Stripe_Price_Intervals,
  SupportStatus,
} from 'src/types/enums/common.enum';
import {
  AUTH_ROLES,
  STRIPE_SUBSCRIPTION_STATUS,
} from 'src/types/enums/user.enum';

// Library Imports
import * as moment from 'moment';

// Utils Imports
import { transporter } from 'src/utils/Email/sendEmail';
import { generateOtpCode } from 'src/utils/OTP/otpGenerator';
import { vacuaEmail } from 'src/utils/Templates/emailConstants';
import { comparePassword, hashPassword } from 'src/utils/bycrpt';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private stripeService: StripeService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private OtpModel: Model<OtpDocument>,
    @InjectModel(Tool.name) private ToolModel: Model<ToolDocument>,
    @InjectModel(Support.name) private supportModel: Model<SupportDocument>,
  ) {}

  //#region : ADMIN AUTHENTICATION FLOW

  // =================== POST: Admin Login ======================
  /**
   * Logs in a admin and returns a JWT token.
   * @param {AdminAuthDTO} admin - The admin's email address and password.
   * @returns {Promise<IUser>} Returns a Promise that resolves to a User object.
   */
  async adminLogin(admin: AdminAuthDTO) {
    try {
      const adminExist = await this.userModel.findOne({
        email: admin.email,
        isAdmin: true,
      });
      if (!adminExist) {
        throw new HttpException('admin does not exist', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = await comparePassword(
        admin.password,
        adminExist.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const authPayload: IAuthPayload = {
        email: adminExist.email,
        id: adminExist._id.toString(),
        type: adminExist.type,
        role: AUTH_ROLES.ADMIN,
      };
      const token = this.jwtService.sign(authPayload);

      return {
        message: 'Admin Login successfully',
        admin: adminExist,
        token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== POST: Request Reset Password ======================
  /**
   * Requests reset pass and returns otp on email.
   * @Param {resetPasswordDto} resetPasswordDTO - The admin's email address.
   * @returns {Promise<{message: string}>} Returns a Promise that resolves to a string.
   */
  async adminRequestResetPassword(
    resetPasswordDTO: resetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      let otpCode: any;
      let currTime = new Date();
      console.log('currTime', currTime);

      let expiryTime = moment().add(15, 'minutes').format();
      console.log('expiryTime', expiryTime);
      const isAdminExist = await this.userModel.findOne({
        email: resetPasswordDTO.email,
        isAdmin: true,
      });
      if (!isAdminExist) {
        throw new HttpException(
          'Admin not found with this email.',
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
          otpCode = generateOtpCode(4);
        }
      } else {
        otpCode = generateOtpCode(4);
      }
      var mailOptions = {
        from: vacuaEmail,
        to: isAdminExist.email,
        subject: 'OTP CHANGED',
        html: `<h1>Your code is ${otpCode}</h1>`,
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('Error transporter email', error);
        } else {
          const insertForgotPassData: IOtp = {
            email: isAdminExist.email,
            code: otpCode,
            expiry: expiryTime,
          };
          const insertedRes = new this.OtpModel(insertForgotPassData);
          const getInsertedRes = await insertedRes.save();
          console.log(getInsertedRes);
        }
      });
      return {
        message: 'Otp has been sent to your email successfully!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== POST: Verify Otp ======================
  /**
   * Otp will send and returns token.
   * @Param {verifyOtpDto} otpCode - The otp.
   * @returns {Promise<{ token: any }>} Returns a Promise that resolves to a token.
   */
  async adminVerifyOtp(otpCode: verifyOtpDto): Promise<{ token: any }> {
    try {
      let currTime = new Date();
      const isCodeVerified = await this.OtpModel.findOne({
        code: otpCode.code,
      });
      if (!isCodeVerified) {
        throw new HttpException('Invalid OTP code', HttpStatus.NOT_FOUND);
      }
      if (currTime > isCodeVerified.expiry) {
        await this.OtpModel.deleteOne({ _id: isCodeVerified._id });
        throw new HttpException(
          'OTP code expired. Please generate new!',
          HttpStatus.NOT_FOUND,
        );
      }
      const token = this.jwtService.sign({
        email: isCodeVerified.email,
      });
      return {
        token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== POST: Reset New Pass ======================
  /**
   * New Pass and token will send and returns success message.
   * @Param {newPasswordDTO} newPass - The password to be set and token.
   * @returns {Promise<{message: string}>} Returns a Promise that resolves to a string.
   */
  async adminResetPass(newPass: newPasswordDTO): Promise<{ message: string }> {
    try {
      const decodedToken = await this.jwtService.verifyAsync(newPass.token);

      const otp = await this.OtpModel.findOne({
        email: decodedToken.email,
      });
      if (!otp) {
        throw new HttpException('Bad Request', HttpStatus.NOT_FOUND);
      }
      const admin = await this.userModel.findOne({
        email: decodedToken.email,
        isAdmin: true,
      });
      const isSameNewPass = await comparePassword(
        newPass.password,
        admin.password,
      );
      if (isSameNewPass) {
        throw new HttpException(
          'Cannot set this password',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const decodedPass = await hashPassword(newPass.password);
      admin.password = decodedPass;
      const updatedAdmin = new this.userModel(admin);
      await updatedAdmin.save();
      await this.OtpModel.deleteOne({ email: decodedToken.email });
      return {
        message:
          'Password has been changed successfully. Redirecting to Login Page',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : USER MANAGEMENT FLOW

  // =================== POST: Add User ======================
  /**
   * Registers a new user and creates a Stripe customer account for the user.
   * @Param {RegisterUserDto} userDocument - The user object containing user registration details.
   * @returns {Promise<IUser>} Returns a Promise that resolves to a User object.
   */
  async addUser(userDocument: RegisterUserDto): Promise<{ user: IUser }> {
    try {
      // check if user already exist
      const isEmailExist = await this.userModel.findOne({
        email: userDocument.email,
        isAdmin: false,
      });
      if (isEmailExist) {
        throw new HttpException('User Already Exist', HttpStatus.CONFLICT);
      }

      // hash user password
      const saltedPassword = await hashPassword(userDocument.password);

      // create new user document in database
      const newUser = new this.userModel({
        // User Details from request Param
        ...userDocument,

        // Salted password
        password: saltedPassword,

        // Default values for new users
        createdAt: new Date(),
        stripeSubscriptionId: null,
        stripeSubscriptionStatus: 'free',
        freeUserHoursLimit: 72, // 3 days free trial
        messagesLimit: 1,
        messagesConsumed: 0,
        freeMessagesLimitExhausted: false,
        profileStatus: null,
      });

      // save user document in database and return saved user
      const savedUser = await newUser.save();

      // create stripe customer account for user and update user document with stripe customer id
      const stripeCustomer: Stripe.Customer =
        await this.stripeService.createCustomer({
          email: savedUser.email.toLowerCase(),
          name: `${savedUser.fullName}`,
        });

      if (!stripeCustomer)
        throw new HttpException(
          'User not updated',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      const user: IUser = await this.userModel.findByIdAndUpdate(
        savedUser._id,
        {
          // Default values for new users
          stripeCustomerId: stripeCustomer.id,
        },
        { new: true, upsert: true },
      );

      return {
        user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== GET: Get Users ======================
  /**
   * @description This endpoint fetch the user array.
   * @Param {number} limit.
   * @Param {number} page.
   * @Param {string} email.
   * @Param {STRIPE_SUBSCRIPTION_STATUS} sub.
   * @returns {Promise<IUser[]>} Returns a Promise that resolves a array of objects.
   */
  async getAllUsers(
    limit: number,
    page: number,
    email: string,
    sub: STRIPE_SUBSCRIPTION_STATUS,
  ) {
    try {
      const pageNo = page || 1;
      const lm = limit || 10;

      let query: IQuery = {
        isAdmin: false,
      };

      if (email) {
        query.email = { $regex: email, $options: 'i' };
      }
      if (sub) {
        query.stripeSubscriptionStatus = sub;
      }

      const users = await this.userModel
        .find(query)
        .skip((pageNo - 1) * lm)
        .limit(lm);

      // query to find count of users matching the query
      const count = await this.userModel.countDocuments(query);

      if (users.length === 0) {
        throw new HttpException('No user found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'users found successfully',
        users: users,
        total: count,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== GET: Get User By Id ======================
  /**
   * @description This endpoint takes in to be user id as param and returns user object by id.
   * @Param {string} user_id - The user_id param in the end point.
   * @returns {Promise<IUser[]>} Returns a Promise that resolves a array of object.
   */
  async getUserById(user_id: string) {
    try {
      const isUserExist = await this.userModel.findOne({
        _id: user_id,
        isAdmin: false,
      });
      if (!isUserExist) {
        throw new HttpException('User by id not found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'User by Id found successfully',
        user: isUserExist,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== PUT: Update User Profile ======================
  /**
   * @description This endpoint takes in to be user profile details and returns the updated user array.
   * @Param {UpdateUserProfileDto} userProfile - The work userProfile includes Work Experience education,  certificates and career aspiration.
   * @returns {Promise<{ message: string; user: IUser }>} Returns a Promise that resolves to a array of objects.
   */
  async updateUserProfile(user_id: string, userProfile: UpdateUserProfileDto) {
    try {
      if (
        userProfile.workExperience &&
        userProfile.workExperience.length === 0
      ) {
        throw new HttpException(
          'Work Experience array can not be empty',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Check if user exists
      const isUserExist = await this.userModel.findOne({
        _id: user_id,
        isAdmin: false,
      });
      if (!isUserExist) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      if (Array.isArray(userProfile.workExperience)) {
        isUserExist.workExperience = userProfile.workExperience;
      }

      if (Array.isArray(userProfile.certificates)) {
        isUserExist.certificates = userProfile.certificates;
      }

      if (Array.isArray(userProfile.education)) {
        isUserExist.education = userProfile.education;
      }

      if (userProfile.industryOfInterest !== undefined) {
        isUserExist.industryOfInterest = userProfile.industryOfInterest;
      }

      if (userProfile.jobPositionLevel !== undefined) {
        isUserExist.jobPositionLevel = userProfile.jobPositionLevel;
      }

      if (userProfile.jobPositionOfInterest !== undefined) {
        isUserExist.jobPositionOfInterest = userProfile.jobPositionOfInterest;
      }

      if (userProfile.age !== undefined) {
        isUserExist.age = userProfile.age;
      }

      if (!!userProfile.fullName) isUserExist.fullName = userProfile.fullName;

      if (!!userProfile.branchOfService)
        isUserExist.branchOfService = userProfile.branchOfService;

      const areFieldsEmpty =
        !isUserExist.industryOfInterest ||
        !isUserExist.jobPositionOfInterest ||
        !isUserExist.jobPositionLevel ||
        !isUserExist.education ||
        !isUserExist.certificates ||
        isUserExist.education.length === 0 ||
        isUserExist.certificates.length === 0;

      // Update the profileStatus
      isUserExist.profileStatus = areFieldsEmpty ? 'incomplete' : 'complete';

      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: isUserExist._id },
        isUserExist,
        { new: true, upsert: true },
      );

      return {
        message: 'User Profile updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== DELETE: Delete User By Id ======================
  /**
   * @description This endpoint takes in to be user id as param and deletes that user object.
   * @Param {string} user_id - The user_id param in the end point.
   * @returns {Promise<message: string>} Returns a Promise that resolves a array of objects.
   */
  async delUser(user_id: string) {
    try {
      // Check if user exists and delete if found
      const deletedUser = await this.userModel.findOneAndDelete({
        _id: user_id,
        isAdmin: false,
      });
      if (!deletedUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      return {
        message: 'User has been deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : OVERVIEW API

  // ================== GET: Get Dashboard Analytics ======================
  /**
   * @description This endpoint fetch the dashboard analytics.
   * @Param No param required.
   * @returns {Promise<any>} Returns a Promise that resolves a array of objects.
   */
  async overview() {
    try {
      // Number of Active Users
      const numOfActiveUsers = await this.userModel
        .find({
          isAdmin: false,
        })
        .count();

      // Number of Paid Users
      const numOfPaidUsers = await this.userModel
        .find({
          isAdmin: false,
          stripeSubscriptionStatus: STRIPE_SUBSCRIPTION_STATUS.ACTIVE,
        })
        .count();

      // Most Used Tool
      const mostUsedTool = await this.ToolModel.find({})
        .sort({ noOfTimeUsed: -1 })
        .limit(1)
        .then((tools) => tools[0].name);
      console.log('mostUsedTool', mostUsedTool);

      // Tools Used
      const toolsUsed = await this.ToolModel.find({}, 'name noOfTimeUsed')
        .sort({ noOfTimeUsed: -1 })
        .exec();

      // Analytics of Active Users
      const userCountByMonthArray = await this.getUsersPerMonth();

      return {
        message: 'The data for the Analytic Dashboard page found successfully',
        numOfActiveUsers: numOfActiveUsers,
        mostUsedTool: mostUsedTool,
        numOfPaidUsers: numOfPaidUsers,
        toolsUsed: toolsUsed,
        userCountByMonthArray: userCountByMonthArray,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsersPerMonth() {
    try {
      const result = await this.userModel.aggregate([
        {
          $match: {
            isAdmin: false, // Add this $match stage to filter isAdmin: false
          },
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 },
          },
        },
      ]);

      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const userCountByMonth = {};

      result.forEach((group) => {
        const monthName = months[group._id - 1];
        userCountByMonth[monthName] = group.count;
      });

      const userCountByMonthArray = months.map((monthName) => ({
        [monthName]: userCountByMonth[monthName] || 0,
      }));

      return userCountByMonthArray;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : SUBSCRIPTION MANAGEMENT FLOW

  // =================== GET: Get Products ======================
  /**
   * This API is used to get all products
   * @returns products
   */
  async getProducts() {
    try {
      const plans = await StripeService.stripe.products.list({
        expand: ['data.default_price'],
        active: true,
      });

      return plans;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== POST: Add product ======================
  /**
   * Add a new product at the stripe.
   * @Param {addProductDTO} body - The body object containing add product details.
   * @returns {Promise<any>} Returns a Promise that resolves to a any object.
   */
  async addProduct(body: addProductDTO) {
    try {
      const newProduct = await StripeService.stripe.products.create({
        name: body.name,
        features: body.features,
        description: body.description,
        metadata: {
          subHeading: 'Full Access',
        },
        default_price_data: {
          unit_amount: body.unit_amount,
          currency: 'usd',
          recurring: {
            interval: Stripe_Price_Intervals.MONTH,
            interval_count: body.interval_count,
          },
        },
      });
      if (!newProduct.id) {
        throw new HttpException(
          'Error in create product by stripe',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: 'New product created successfully',
        product: newProduct,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== PUT: Update product ======================
  /**
   * Update a product at the stripe.
   * @Param {string} product_id
   * @Param {updateProductDTO} body - The body object containing update product details.
   * @returns {Promise<any>} Returns a Promise that resolves to a any object.
   */
  async updateProduct(product_id: string, body: updateProductDTO) {
    try {
      const updatedProduct = await StripeService.stripe.products.update(
        product_id,
        {
          description: body.description,
          features: body.features,
          name: body.name,
        },
      );
      if (!updatedProduct.id) {
        throw new HttpException(
          'Error in updating product by stripe',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: 'Product updated successfully by stripe',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : ADMIN SUPPORT APIs

  async getSupports(
    limit: number,
    page: number,
    email: string,
    status: SupportStatus,
  ): Promise<{ message: string; supports: ISupport[],total:number }> {
    try {
      const pageNo = page || 1;
      const lm = limit || 10;

      let query: ISupportQuery = {};

      if (email) {
        query.email = { $regex: email, $options: 'i' };
      }
      if (status) {
        query.status = status;
      }
      const allSupports = await this.supportModel
        .find(query)
        .skip((pageNo - 1) * lm)
        .limit(lm);

      const total = await this.supportModel.countDocuments(query);

      if (allSupports.length === 0) {
        throw new HttpException('No support found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'Supports found successfully',
        supports: allSupports,
        total: total,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSupportById(
    support_id: string,
  ): Promise<{ message: string; support: ISupport }> {
    try {
      const supportById = await this.supportModel.findById(support_id);
      if (!supportById) {
        throw new HttpException('No support by id found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Support by Id found successfully',
        support: supportById,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async replySupport(body: SupportReplyDTO): Promise<{ message: string }> {
    try {
      const { supportId, reply } = body;
      const supportExist = await this.supportModel.findById(supportId);
      if (!supportExist) {
        throw new HttpException('No support by id found', HttpStatus.NOT_FOUND);
      }

      const mailOptions = {
        from: vacuaEmail,
        to: supportExist.email,
        subject: 'ADMIN SUPPORT REPLY',
        html: `
          <h1>Support Information:</h1>
          <p><strong>Name:</strong> ${supportExist.name}</p>
          <p><strong>Email:</strong> ${supportExist.email}</p>
          <p><strong>Question:</strong> ${supportExist.question}</p>
          <p><strong>Answer:</strong> ${reply}</p>
        `,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
          throw new HttpException(
            'Unable to reply to the user via email',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          // Update the support details
          supportExist.reply = reply;
          supportExist.status = SupportStatus.RESOLVED;

          const updatedSupport = await this.supportModel.findByIdAndUpdate(
            supportExist._id,
            supportExist,
            { new: true, upsert: false },
          );
        }
      });
      return {
        message: 'Admin successfully replied to the user',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion
}
