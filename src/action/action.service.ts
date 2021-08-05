import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionNode } from '../entity/ActionNode';
import { NodePath } from '@babel/core';
import { ExecutionContext } from '../lib/ExecutionContext';
import { PlayerState } from '../entity/PlayerState';
import { PlayerChoice } from '../entity/PlayerChoice';

export class InvalidProgramError extends Error {
  public statusCode = 422;
  public message = 'Incorrect program';
  constructor(public readonly node: NodePath) {
    super();
  }
}

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(ActionNode)
    private actions: Repository<ActionNode>,
    @InjectRepository(PlayerState)
    private playerStates: Repository<PlayerState>,
    @InjectRepository(PlayerChoice)
    private playerChoices: Repository<PlayerChoice>,
  ) {}

  async create(actionDto: CreateActionDto) {
    const action = this.actions.create(actionDto);

    return this.actions.save(action);
  }

  async execute(id: number, userId: number) {
    const action = await this.actions.findOne(id, {
      relations: ['sequence'],
    });
    const playerState = await this.playerStates.findOne({
      where: {
        userId,
        storyId: action.sequence.storyId,
      },
    });
    const playerChoice = await this.playerChoices.findOne({
      where: {
        choiceId: action.sequence.choiceId,
        userId,
      },
      relations: ['choice', 'option'],
    });
    const variableMap = playerState.toMap();
    const context = new ExecutionContext(
      variableMap,
      action.sequence,
      playerChoice.option,
    );
    context.runProgram(action.program);
    playerState.setState(variableMap);

    return await this.playerStates.save(playerState);
  }
}
