import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import IUser from '../users/interface/user.interface';
import { AuthDTO } from './DTO/auth.dto';
import { RegisterUserDto } from './DTO/registerUser.dto';
import { newPassDto } from './DTO/newPassword.dto';
import { resetPasswordDto } from './DTO/resetPassword.dto';
import { UserDocument } from 'src/schemas/users/user.schema';
import { OtpDocument } from 'src/schemas/otp/otp.schema';
import { StripeService } from '../stripe/stripe.service';
export declare class AuthService {
    private jwtService;
    private stripeService;
    private userModel;
    private OtpModel;
    constructor(jwtService: JwtService, stripeService: StripeService, userModel: Model<UserDocument>, OtpModel: Model<OtpDocument>);
    login(user: AuthDTO): Promise<{
        user: IUser;
        token: string;
    }>;
    register(userDocument: RegisterUserDto): Promise<{
        user: IUser;
        token: string;
    }>;
    requestResetPassword(resetPasswordDTO: resetPasswordDto): Promise<{
        message: string;
    }>;
    resetPass(newPass: newPassDto): Promise<{
        message: string;
    }>;
}
