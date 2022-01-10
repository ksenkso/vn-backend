import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entity/RefreshToken';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokens: Repository<RefreshToken>,
  ) {}

  async signUp(req: Request): Promise<User> {
    return this.usersService.create(req.body.username, req.body.password);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await user.comparePassword(pass))) {
      return user.withoutPassword();
    }
    return null;
  }

  async login(user: any) {
    return this.createPayload(user);
  }

  async refresh(refreshToken: string) {
    const token = await this.refreshTokens.findOne(
      { token: refreshToken },
      { relations: ['user'] },
    );
    if (token) {
      await this.refreshTokens.delete(token);
      if (this.jwtService.verify(refreshToken)) {
        return this.createPayload(token.user);
      }
    }

    throw new Error('Refresh token is invalid');
  }

  private async createPayload(user: any): Promise<TokenPair> {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '30 days' },
    );

    const tokenRecord = this.refreshTokens.create({
      token: refreshToken,
      userId: user.id,
    });
    await this.refreshTokens.save(tokenRecord);

    return {
      accessToken: this.jwtService.sign(
        {
          sub: user.id,
          username: user.username,
          roles: user.roles,
        },
        { expiresIn: '10m' },
      ),
      refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokens.delete({
      token: refreshToken,
    });
  }
}
