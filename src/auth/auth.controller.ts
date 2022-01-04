import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService, TokenPair } from './auth.service';
import { JwtGuard } from './jwt.guard';
import { LocalGuard } from './local.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async signUp(@Req() req: Request) {
    const user = await this.authService.signUp(req);
    return user.withoutPassword();
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.login(req.user);

    return AuthController.sendAuthData(res, tokens);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const tokens = await this.authService.refresh(
        req.signedCookies.refreshToken,
      );

      return AuthController.sendAuthData(res, tokens);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private static sendAuthData(response: Response, tokens: TokenPair) {
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      domain: process.env.DOMAIN,
    });
    return response.send({ accessToken: tokens.accessToken });
  }
}
