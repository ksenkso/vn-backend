import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RouterNode } from '../../entity/RouterNode';
import { Repository } from 'typeorm';
import { RouteCondition } from '../../entity/RouteCondition';
import { CreateRouterDto } from './dto/router.dto';
import { parse } from '@babel/parser';
import t, { File, Program } from '@babel/types';
import { Sequence } from '../../entity/Sequence';
import { PlayerState } from '../../entity/PlayerState';
import { PlayerChoice } from '../../entity/PlayerChoice';
import { ExecutionContext } from '../../lib/ExecutionContext';
import { User } from '../../entity/user.entity';
import { ModuleRef } from '@nestjs/core';
import { TransactionFor } from 'nest-transact';

@Injectable()
export class RouterService extends TransactionFor<RouterService> {
  constructor(
    @InjectRepository(RouterNode)
    private routers: Repository<RouterNode>,
    @InjectRepository(RouteCondition)
    private conditions: Repository<RouteCondition>,
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
    @InjectRepository(PlayerState)
    private playerStates: Repository<PlayerState>,
    @InjectRepository(PlayerChoice)
    private playerChoices: Repository<PlayerChoice>,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(routerDto: CreateRouterDto) {
    let conditions;
    if (routerDto.conditions) {
      conditions = routerDto.conditions;
      delete routerDto.conditions;
    }
    const router = this.routers.create();
    const newRouter = await this.routers.save(router);

    if (conditions) {
      const newConditions = this.conditions.create(
        conditions.map((route) => {
          return {
            condition: parse(route.condition) as File,
            routerId: newRouter.id,
            sequenceId: route.sequenceId,
          };
        }),
      );
      newRouter.conditions = await this.conditions.save(newConditions);
    }

    if (routerDto.sequenceId) {
      await this.sequences.update(
        { id: routerDto.sequenceId },
        { routerId: newRouter.id },
      );
    }

    return newRouter;
  }

  async createWithDefaultRoute(sequenceId: number, destinationSequenceId: number) {
    const router = this.routers.create();
    const newRouter = await this.routers.save(router);

    newRouter.conditions = [await this.addDefaultRoute(newRouter.id, destinationSequenceId)];

    return newRouter;
  }

  async addDefaultRoute(routerId: number, destinationSequenceId: number) {
    const condition = this.buildAlwaysTrueCondition();

    const route = this.conditions.create({ routerId, sequenceId: destinationSequenceId, condition });

    return this.conditions.save(route);
  }

  async route(sequenceId: number, user: User): Promise<Sequence | undefined> {
    const sourceSequence = await this.sequences.findOne({
      where: { id: sequenceId },
      relations: ['router', 'router.conditions', 'router.conditions.sequence'],
    });
    const choice = await this.playerChoices.findOne({
      where: {
        choiceId: sourceSequence.choiceId,
        userId: user.id,
      },
    });
    const state = await this.playerStates.findOneBy({ userId: user.id });
    const condition = sourceSequence.router.conditions.find((condition) => {
      const context = new ExecutionContext(
        state.toMap(),
        sourceSequence,
        choice?.option,
      );
      return context.runProgram(condition.condition);
    });

    if (condition) {
      return condition.sequence;
    }
  }

  private buildAlwaysTrueCondition() {
    return parse('true;')
  }

  async addRoute() {
    // TODO
  }
}
