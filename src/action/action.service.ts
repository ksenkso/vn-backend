import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionNode } from '../entity/ActionNode';
import { NodePath, parse } from '@babel/core';
import traverse from '@babel/traverse';
import { ALLOWED_TYPES } from '../lib/utils';

export class InvalidProgramError extends Error {
  constructor(public readonly node: NodePath) {
    super();
  }
}

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(ActionNode)
    private actions: Repository<ActionNode>,
  ) {}

  async create(actionDto: CreateActionDto) {
    await this.validateProgram(actionDto.program);
    const action = this.actions.create(actionDto);

    return this.actions.save(action);
  }

  async validateProgram(program: string) {
    const ast = parse(program);
    traverse(ast, {
      enter(node) {
        if (!ALLOWED_TYPES.has(node.type)) {
          throw new InvalidProgramError(node);
        }
      },
    });
  }
}
