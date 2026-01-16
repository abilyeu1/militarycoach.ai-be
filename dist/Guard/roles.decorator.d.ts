import { AUTH_ROLES, UserTypes } from 'src/types/enums/user.enum';
export declare const HasRoles: (...roles: UserTypes[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const HasAuthRoles: (...authRoles: AUTH_ROLES[]) => import("@nestjs/common").CustomDecorator<string>;
