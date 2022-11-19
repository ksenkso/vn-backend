import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RouterNode } from '../../entity/RouterNode';
import { Repository } from 'typeorm';
import { RouteCondition } from '../../entity/RouteCondition';
import { CreateRouterDto } from './dto/router.dto';
import { parse } from '@babel/parser';
import { File } from '@babel/types';
import { Sequence } from '../../entity/Sequence';
import { PlayerState } from '../../entity/PlayerState';
import { PlayerChoice } from '../../entity/PlayerChoice';
import { ExecutionContext } from '../../lib/ExecutionContext';
import { User } from '../../entity/user.entity';

@Injectable()
export class RouterService {
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
  ) {}

  async create(routerDto: CreateRouterDto) {
    let conditions;
    if (routerDto.conditions) {
      conditions = routerDto.conditions;
      delete routerDto.conditions;
    }
    const router = this.routers.create(
      routerDto as Omit<CreateRouterDto, 'conditions'>,
    );
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

    return newRouter;
  }

  async route(sequenceId: number, user: User): Promise<Sequence | undefined> {
    const sourceSequence = await this.sequences.findOne(sequenceId, {
      relations: ['router', 'router.conditions', 'router.conditions.sequence'],
    });
    const choice = await this.playerChoices.findOne({
      where: {
        choiceId: sourceSequence.choiceId,
        userId: user.id,
      },
    });
    const state = await this.playerStates.findOne({ userId: user.id });
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
}
