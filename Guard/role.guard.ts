import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserTypes } from 'src/types/enums/user.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserTypes[]>('roles', [
      context.getHandler(),
    ]);

    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    const hasRole = () => roles.includes(user.type);

    if (user && user.type && hasRole()) {
      return true;
    }

    throw new HttpException(
      'You do not have permission for this API',
      HttpStatus.FORBIDDEN,
    );
  }
}
