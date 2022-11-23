import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user) {
      return RolesGuard.matchRoles(roles, user.roles);
    } else {
      return false;
    }
  }

  private static matchRoles(userRoles: string[], rolesToMatch: string[]) {
    for (const role of rolesToMatch) {
      if (userRoles.includes(role)) {
        return true;
      }
    }
    return false;
  }
}
