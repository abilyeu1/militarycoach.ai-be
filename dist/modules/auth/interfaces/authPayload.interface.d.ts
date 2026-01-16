import { AUTH_ROLES, UserTypes } from 'src/types/enums/user.enum';
export interface IAuthPayload {
    email: string;
    type: UserTypes;
    id: string;
    role: AUTH_ROLES;
}
