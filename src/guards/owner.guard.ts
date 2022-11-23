import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { User } from '../entity/user.entity';
import { UsersService } from '../slices/users/users.service';

export class OwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {
  }

  /**
   * TODO: get parameters of the accessed resource and pass them to the service
   * @param context
   */
  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest<Request>().user as User | undefined;

    if (!user) return false;

    const models = this.reflector.get<any[]>('OnlyOwner', context.getHandler());

    if (!models) {
      return true;
    }

    return this.usersService.checkOwnership(user, models);
  }
}
