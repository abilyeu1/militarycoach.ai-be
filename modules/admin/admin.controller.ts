// Nest JS Imports
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Put,
  Delete,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

// Services Imports
import { AdminService } from './admin.service';

// Guard Imports
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { AuthRoleGuard } from 'src/Guard/authRole.guard';

// DTO Imports
import { resetPasswordDto } from '../auth/DTO/resetPassword.dto';
import { verifyOtpDto } from '../auth/DTO/verifyOtp.dto';
import { RegisterUserDto } from '../auth/DTO/registerUser.dto';
import { UpdateUserProfileDto } from '../users/DTO/updateUserProfile.dto';
import { addProductDTO } from './DTO/addProduct.dto';
import { updateProductDTO } from './DTO/updateProduct.dto';
import { AdminAuthDTO } from './DTO/adminAuth.dto';
import { newPasswordDTO } from './DTO/newPassword.dto';
import { SupportReplyDTO } from './DTO/supportReply.dto';

// Interfaces Imports
import { ExtendedRequest } from 'src/utils/Templates/extented-request.interface';
import ISupport from '../users/interface/support.interface';

// Enum Imports
import {
  AUTH_ROLES,
  STRIPE_SUBSCRIPTION_STATUS,
} from 'src/types/enums/user.enum';
import { SupportStatus } from 'src/types/enums/common.enum';

// Decorator Imports
import { HasAuthRoles } from 'src/Guard/roles.decorator';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //#region : ADMIN AUTHENTICATION FLOW

  // =================== POST: Admin Login ======================
  /**
   * Logs in a admin and returns a JWT token.
   * @param {AdminAuthDTO} authData - The admin's email address and password.
   * @returns {Promise<IUser>} Returns a Promise that resolves to a User object.
   */
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() authData: AdminAuthDTO) {
    return await this.adminService.adminLogin(authData);
  }

  // =================== POST: Request Reset Password ======================
  /**
   * Requests reset pass and returns otp on email.
   * @Body {resetPasswordDTO} reqBody - The admin's email address.
   * @returns {Promise<{message: string}>} Returns a Promise that resolves to a string.
   */
  @Post('requestResetPassword')
  @UsePipes(ValidationPipe)
  async requestResetPassword(
    @Body() reqBody: resetPasswordDto,
  ): Promise<{ message: string }> {
    return await this.adminService.adminRequestResetPassword(reqBody);
  }

  // =================== POST: Verify Otp ======================
  /**
   * Otp will send and returns token.
   * @Body {verifyOtpDto} reqBody - The otp.
   * @returns {Promise<{ token: any }>} Returns a Promise that resolves to a token.
   */
  @Post('verifyOtp')
  @UsePipes(ValidationPipe)
  async verifyOtp(@Body() reqBody: verifyOtpDto): Promise<{ token: any }> {
    return await this.adminService.adminVerifyOtp(reqBody);
  }

  // =================== POST: Reset New Pass ======================
  /**
   * New Pass and token will send and returns success message.
   * @Body {newPasswordDTO} reqBody - The password to be set and token.
   * @returns {Promise<{message: string}>} Returns a Promise that resolves to a string.
   */
  @Post('resetPassword')
  @UsePipes(ValidationPipe)
  async resetPassword(
    @Body() reqBody: newPasswordDTO,
  ): Promise<{ message: string }> {
    return await this.adminService.adminResetPass(reqBody);
  }

  //#endregion

  //#region : USER MANAGEMENT FLOW

  // =================== POST: Add User ======================
  /**
   * Registers a new user and creates a Stripe customer account for the user.
   * @Body {RegisterUserDto} user - The user object containing user registration details.
   * @returns {Promise<IUser>} Returns a Promise that resolves to a User object.
   */
  @Post('/add-user')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  @UsePipes(ValidationPipe)
  async addUser(@Body() user: RegisterUserDto) {
    return await this.adminService.addUser(user);
  }

  // =================== GET: Get Users ======================
  /**
   * @description This endpoint fetch the user array.
   * @body No body required.
   * @Query {number} limit.
   * @Query {number} page.
   * @Query {string} email.
   * @Query {STRIPE_SUBSCRIPTION_STATUS} sub.
   * @returns {Promise<IUser[]>} Returns a Promise that resolves a array of objects.
   */
  @ApiQuery({
    name: 'email',
    required: false,
  })
  @Get('get-users')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  @ApiQuery({
    name: 'subscription',
    enum: STRIPE_SUBSCRIPTION_STATUS,
  })
  async fetchUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('email') email: string,
    @Query('subscription') sub: STRIPE_SUBSCRIPTION_STATUS,
  ) {
    const result = await this.adminService.getAllUsers(limit, page, email, sub);
    return result;
  }

  // =================== GET: Get User By Id ======================
  /**
   * @description This endpoint takes in to be user id as param and returns user object by id.
   * @body {string} user_id - The user_id param in the end point.
   * @returns {Promise<IUser[]>} Returns a Promise that resolves a array of object.
   */
  @Get('get-user/:user_id')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  async getUserById(@Param('user_id') id: string, @Req() req: ExtendedRequest) {
    const { role } = req.user;
    return await this.adminService.getUserById(id);
  }

  // =================== PUT: Update User Profile ======================
  /**
   * @description This endpoint takes in to be user profile details and returns the updated user array.
   * @body {UpdateUserProfileDto} userProfile - The work userProfile includes Work Experience education,  certificates and career aspiration.
   * @returns {Promise<{ message: string; user: IUser }>} Returns a Promise that resolves to a array of objects.
   */
  @Put('edit-user/:user_id')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  @UsePipes(ValidationPipe)
  async updateUserProfile(
    @Body() userProfile: UpdateUserProfileDto,
    @Param('user_id') id: string,
  ) {
    return await this.adminService.updateUserProfile(id, userProfile);
  }

  // =================== DELETE: Delete User By Id ======================
  /**
   * @description This endpoint takes in to be user id as param and deletes that user object.
   * @body {string} user_id - The user_id param in the end point.
   * @returns {Promise<message: string>} Returns a Promise that resolves a array of objects.
   */
  @Delete('delete-user/:user_id')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  async delUser(@Param('user_id') id: string) {
    return await this.adminService.delUser(id);
  }

  //#endregion

  //#region : OVERVIEW API

  // ================== GET: Get Dashboard Analytics ======================
  /**
   * @description This endpoint fetch the dashboard analytics.
   * @body No body required.
   * @returns {Promise<any>} Returns a Promise that resolves a array of objects.
   */
  @Get('analytic-overview')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  async overview() {
    return await this.adminService.overview();
  }

  //#endregion

  //#region : SUBSCRIPTION MANAGEMENT FLOW

  // =================== GET: Get Products ======================
  /**
   * This API is used to get all products
   * @returns products
   */
  @Get('products')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  async getProducts() {
    return await this.adminService.getProducts();
  }

  // =================== POST: Add product ======================
  /**
   * Add a new product at the stripe.
   * @Body {addProductDTO} body - The body object containing add product details.
   * @returns {Promise<any>} Returns a Promise that resolves to a any object.
   */
  @Post('add-product')
  @UsePipes(ValidationPipe)
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  async addProduct(@Body() body: addProductDTO) {
    return await this.adminService.addProduct(body);
  }

  // =================== PUT: Update product ======================
  /**
   * Update a product at the stripe.
   * @Param {string} product_id
   * @Body {updateProductDTO} body - The body object containing update product details.
   * @returns {Promise<any>} Returns a Promise that resolves to a any object.
   */
  @Put('edit-product/:product_id')
  @UsePipes(ValidationPipe)
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  async editProduct(
    @Param('product_id') id: string,
    @Body() body: updateProductDTO,
  ) {
    return await this.adminService.updateProduct(id, body);
  }

  //#endregion

  //#region : ADMIN SUPPORT APIs

  // =================== GET: Get Supports ======================
  /**
   * @description This endpoint fetch the support array.
   * @body No body required.
   * @Query {number} limit.
   * @Query {number} page.
   * @Query {string} email.
   * @Query {SupportStatus} status.
   * @returns {Promise<{message: string; supports: ISupport[]}>} Returns a Promise that resolves a array of objects.
   */

  @Get('get-supports')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  @ApiQuery({
    name: 'status',
    enum: SupportStatus,
    required: false,
  })
  @ApiQuery({
    name: 'email',
    required: false,
  })
  async fetchSupports(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('email') email: string,
    @Query('status') status: SupportStatus,
  ): Promise<{ message: string; supports: ISupport[] }> {
    const result = await this.adminService.getSupports(
      limit,
      page,
      email,
      status,
    );
    return result;
  }

  // =================== GET: Get Support By Id ======================
  /**
   * @description This endpoint takes in to be support id as param and returns support object by id.
   * @body {string} support_id - The support_id param in the end point.
   * @returns {Promise<{message: string; support: ISupport}>} Returns a Promise that resolves a object.
   */
  @Get('get-support/:support_id')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  async getSupportById(
    @Param('support_id') id: string,
  ): Promise<{ message: string; support: ISupport }> {
    return await this.adminService.getSupportById(id);
  }

  // =================== POST: Post Support Reply ======================
  /**
   * @description This endpoint takes in SupportReplyDTO as body and returns support reply on email.
   * @body {SupportReplyDTO} body - The body in this end point.
   * @returns {Promise<{message:string}>} Returns a Promise that resolves a message string.
   */
  @Post('reply-support')
  @HasAuthRoles(AUTH_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, AuthRoleGuard)
  @ApiBearerAuth('jwt')
  async replySupport(
    @Body() body: SupportReplyDTO,
  ): Promise<{ message: string }> {
    return await this.adminService.replySupport(body);
  }

  //#endregion
}
