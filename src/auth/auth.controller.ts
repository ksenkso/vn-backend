import { Controller, Get, Post, Req, Res, Session as GetSession, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard';
import { LocalGuard } from './local.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Session } from 'express-session';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Roles('admin')
  @UseGuards(SessionGuard, RolesGuard)
  @Post()
  async signUp(@Req() req: Request) {
    const user = await this.authService.signUp(req);
    return user.withoutPassword();
  }

  @UseGuards(LocalGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async login() {
  }

  @Post('logout')
  async logout(@Res() res: Response, @GetSession() session: Session) {
    session.destroy(err => {
      if (err) {
        throw err;
      }

      res.status(200).end();
    });
  }

  @UseGuards(SessionGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
