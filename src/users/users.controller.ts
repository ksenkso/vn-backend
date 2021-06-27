import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles('admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  index() {
    return this.usersService.findAll();
  }

  @Patch()
  async update(@Req() request: Request) {
    return this.usersService.updateByName(request.body);
  }
}
