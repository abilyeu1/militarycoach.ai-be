import { AuthService } from './auth.service';
import { AuthDTO } from './DTO/auth.dto';
import { RegisterUserDto } from './DTO/registerUser.dto';
import { resetPasswordDto } from './DTO/resetPassword.dto';
import { newPassDto } from './DTO/newPassword.dto';
import IUser from '../users/interface/user.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    logIn(authData: AuthDTO): Promise<{
        user: IUser;
        token: string;
    }>;
    register(user: RegisterUserDto): Promise<{
        user: IUser;
        token: string;
    }>;
    requestResetPassword(reqBody: resetPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(reqBody: newPassDto): Promise<{
        message: string;
    }>;
}
