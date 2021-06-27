import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      // Provide the reason of the auth error
      throw err || new UnauthorizedException(info);
    }
    return user;
  }
}
