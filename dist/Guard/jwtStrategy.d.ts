import { ConfigService } from "@nestjs/config";
import { IAuthPayload } from "src/modules/auth/interfaces/authPayload.interface";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: IAuthPayload): Promise<{
        email: string;
        id: string;
        type: import("../types/enums/user.enum").UserTypes;
        role: import("../types/enums/user.enum").AUTH_ROLES;
    }>;
}
export {};
