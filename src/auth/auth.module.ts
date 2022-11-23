import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../slices/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { RefreshToken } from '../entity/RefreshToken';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({
      session: true,
    }),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
