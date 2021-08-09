import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateRouterDto } from './dto/router.dto';
import { RouterService } from './router.service';

@Controller('router')
export class RouterController {
  constructor(private routerService: RouterService) {}

  @Post()
  create(@Body() routerDto: CreateRouterDto) {
    return this.routerService.create(routerDto);
  }
}
