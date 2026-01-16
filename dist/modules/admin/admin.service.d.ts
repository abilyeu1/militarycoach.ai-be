/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { OtpDocument } from 'src/schemas/otp/otp.schema';
import { SupportDocument } from 'src/schemas/support/support.schema';
import { Tool, ToolDocument } from 'src/schemas/tools/tools.schema';
import { User, UserDocument } from 'src/schemas/users/user.schema';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { JwtService } from '@nestjs/jwt';
import { StripeService } from '../stripe/stripe.service';
import { RegisterUserDto } from '../auth/DTO/registerUser.dto';
import { resetPasswordDto } from '../auth/DTO/resetPassword.dto';
import { verifyOtpDto } from '../auth/DTO/verifyOtp.dto';
import { UpdateUserProfileDto } from '../users/DTO/updateUserProfile.dto';
import { addProductDTO } from './DTO/addProduct.dto';
import { AdminAuthDTO } from './DTO/adminAuth.dto';
import { newPasswordDTO } from './DTO/newPassword.dto';
import { SupportReplyDTO } from './DTO/supportReply.dto';
import { updateProductDTO } from './DTO/updateProduct.dto';
import ISupport from '../users/interface/support.interface';
import IUser from '../users/interface/user.interface';
import { SupportStatus } from 'src/types/enums/common.enum';
import { STRIPE_SUBSCRIPTION_STATUS } from 'src/types/enums/user.enum';
export declare class AdminService {
    private jwtService;
    private stripeService;
    private userModel;
    private OtpModel;
    private ToolModel;
    private supportModel;
    constructor(jwtService: JwtService, stripeService: StripeService, userModel: Model<UserDocument>, OtpModel: Model<OtpDocument>, ToolModel: Model<ToolDocument>, supportModel: Model<SupportDocument>);
    adminLogin(admin: AdminAuthDTO): Promise<{
        message: string;
        admin: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        token: string;
    }>;
    adminRequestResetPassword(resetPasswordDTO: resetPasswordDto): Promise<{
        message: string;
    }>;
    adminVerifyOtp(otpCode: verifyOtpDto): Promise<{
        token: any;
    }>;
    adminResetPass(newPass: newPasswordDTO): Promise<{
        message: string;
    }>;
    addUser(userDocument: RegisterUserDto): Promise<{
        user: IUser;
    }>;
    getAllUsers(limit: number, page: number, email: string, sub: STRIPE_SUBSCRIPTION_STATUS): Promise<{
        message: string;
        users: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        total: number;
    }>;
    getUserById(user_id: string): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    updateUserProfile(user_id: string, userProfile: UpdateUserProfileDto): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    delUser(user_id: string): Promise<{
        message: string;
    }>;
    overview(): Promise<{
        message: string;
        numOfActiveUsers: number;
        mostUsedTool: string;
        numOfPaidUsers: number;
        toolsUsed: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Tool> & Tool & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, Tool> & Tool & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        userCountByMonthArray: {
            [x: string]: any;
        }[];
    }>;
    getUsersPerMonth(): Promise<{
        [x: string]: any;
    }[]>;
    getProducts(): Promise<Stripe.Response<Stripe.ApiList<Stripe.Product>>>;
    addProduct(body: addProductDTO): Promise<{
        message: string;
        product: Stripe.Response<Stripe.Product>;
    }>;
    updateProduct(product_id: string, body: updateProductDTO): Promise<{
        message: string;
    }>;
    getSupports(limit: number, page: number, email: string, status: SupportStatus): Promise<{
        message: string;
        supports: ISupport[];
        total: number;
    }>;
    getSupportById(support_id: string): Promise<{
        message: string;
        support: ISupport;
    }>;
    replySupport(body: SupportReplyDTO): Promise<{
        message: string;
    }>;
}
