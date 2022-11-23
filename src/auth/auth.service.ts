import { Injectable } from '@nestjs/common';
import { UsersService } from '../slices/users/users.service';
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
    @InjectRepository(RefreshToken)
    private refreshTokens: Repository<RefreshToken>,
  ) {}

  async signUp(req: Request): Promise<User> {
    return this.usersService.create(req.body.username, req.body.password);
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(username);
    if (user && (await user.comparePassword(pass))) {
      return user;
    }
    return null;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokens.delete({
      token: refreshToken,
    });
  }
}
