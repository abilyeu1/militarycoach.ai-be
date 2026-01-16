import { Request } from 'express';
import { IAuthPayload } from 'src/modules/auth/interfaces/authPayload.interface';
export interface ExtendedRequest extends Request {
    user: IAuthPayload;
}
