import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateRouterDto } from './dto/router.dto';
import { RouterService } from './router.service';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../entity/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/jwt.guard';
import { DataSource } from 'typeorm';

@Controller('router')
export class RouterController {
  constructor(
    private routerService: RouterService,
    private readonly ds: DataSource,
  ) {}

  @Post()
  create(@Body() routerDto: CreateRouterDto) {
    return this.ds.transaction(manager => {
      return this.routerService
        .withTransaction(manager)
        .create(routerDto);
    })
  }

  @UseGuards(JwtGuard)
  @Get('/:sequenceId')
  route(@Param('sequenceId') sequenceId: number, @Req() request: Request) {
    const user = request.user as User;
    return this.routerService.route(sequenceId, user);
  }
}
