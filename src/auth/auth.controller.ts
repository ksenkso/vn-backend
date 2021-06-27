import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
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
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Query('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(
      req.header('Authorization').slice('Bearer '.length),
      refreshToken,
    );
  }
}
