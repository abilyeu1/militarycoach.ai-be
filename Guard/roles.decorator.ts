import { SetMetadata } from '@nestjs/common';
import { AUTH_ROLES, UserTypes } from 'src/types/enums/user.enum';
// import { UserTypes } from "src/Types/types";

export const HasRoles = (...roles: UserTypes[]) => SetMetadata('roles', roles);

export const HasAuthRoles = (...authRoles: AUTH_ROLES[]) => SetMetadata('authRoles', authRoles);
