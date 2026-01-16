import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { AUTH_ROLES } from 'src/types/enums/user.enum';
  
  @Injectable()
  export class AuthRoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const roles = this.reflector.getAllAndOverride<AUTH_ROLES[]>('authRoles', [
        context.getHandler(),
      ]);
  
      if (!roles) return true;
  
      const { user } = context.switchToHttp().getRequest();
  
      const hasAuthRole = () => roles.includes(user.role);
  
      if (user && user.role && hasAuthRole()) {
        return true;
      }
  
      throw new HttpException(
        'You do not have permission for this API',
        HttpStatus.FORBIDDEN,
      );
    }
  }
  