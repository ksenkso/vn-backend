import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RouterNode } from '../entity/RouterNode';
import { Repository } from 'typeorm';
import { RouteCondition } from '../entity/RouteCondition';
import { CreateRouterDto } from './dto/router.dto';
import { parse } from '@babel/parser';
import { File } from '@babel/types';

@Injectable()
export class RouterService {
  constructor(
    @InjectRepository(RouterNode)
    private routers: Repository<RouterNode>,
    @InjectRepository(RouteCondition)
    private conditions: Repository<RouteCondition>,
  ) {}

  async create(routerDto: CreateRouterDto) {
    const router = this.routers.create(routerDto);
    const newRouter = await this.routers.save(router);

    if (routerDto.routes) {
      const conditions = this.conditions.create(
        routerDto.routes.map((route) => {
          return {
            condition: parse(route.condition) as File,
            routerId: newRouter.id,
            sequenceId: route.sequenceId,
          };
        }),
      );
      newRouter.conditions = await this.conditions.save(conditions);
    }

    return newRouter;
  }
}
