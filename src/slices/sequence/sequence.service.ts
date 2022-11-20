import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSequenceDto, UpdateSequenceDto } from '../story/dto/sequence.dto';
import { Sequence } from '../../entity/Sequence';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { SequenceNode } from '../../entity/SequenceNode';
import { Story } from '../../entity/Story';
import { User } from '../../entity/user.entity';
import { ExecutionContext } from '../../lib/ExecutionContext';
import { PlayerState } from '../../entity/PlayerState';
import { PlayerChoice } from '../../entity/PlayerChoice';
import { GraphSequence } from './dto/sequence-node.dto';
import { SequenceValidator } from './sequence.validator';
import { RouterNode } from '../../entity/RouterNode';
import { ModuleRef } from '@nestjs/core';
import { TransactionFor } from 'nest-transact';

@Injectable()
export class SequenceService extends TransactionFor<SequenceService> {
  constructor(
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
    @InjectRepository(SequenceNode)
    private nodes: Repository<SequenceNode>,
    @InjectRepository(Story)
    private stories: Repository<Story>,
    @InjectRepository(PlayerState)
    private playerStates: Repository<PlayerState>,
    @InjectRepository(PlayerChoice)
    private playerChoices: Repository<PlayerChoice>,
    @InjectRepository(RouterNode)
    private routers: Repository<RouterNode>,
    private sequenceDtoValidator: SequenceValidator,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(sequenceDto: CreateSequenceDto): Promise<Sequence> {
    await this.sequenceDtoValidator.validateCreate(sequenceDto);

    return this.createWithoutValidation(sequenceDto);
  }

  async createWithoutValidation(sequenceDto: CreateSequenceDto) {
    const sequence = this.sequences.create(sequenceDto);

    const newSequence = await this.sequences.save(sequence);

    if (sequenceDto.root) {
      await this.stories.update(
        { id: sequenceDto.storyId },
        { rootId: newSequence.id }
      );
    }

    const router = this.routers.create();
    newSequence.router = await this.routers.save(router);

    return newSequence;
  }

  async get(sequenceId: number): Promise<Sequence | void> {
    const nodesQuery = this.nodes.find({
      where: { sequenceId },
    });
    const sequenceQuery = this.sequences.findOne({
      where: { id: sequenceId },
      relations: ['choice', 'choice.options'],
    });
    return Promise.all([nodesQuery, sequenceQuery])
      .then(([nodes, sequence]) => {
        SequenceService.sortNodesList(nodes);

        return {
          ...sequence,
          nodes,
        } as Sequence;
      })
      .catch((error) => {
        if (error instanceof QueryFailedError) {
          console.log(error.query, error.parameters);
        } else {
          throw error;
        }
      });
  }

  async update(id: number, sequenceDto: UpdateSequenceDto) {
    return this.sequences.update(id, sequenceDto);
  }

  private static sortNodesList(nodes: SequenceNode[]) {
    nodes.sort((a, b) => {
      if (a.prevId === null) return -1;
      if (b.prevId === null) return 1;
      if (a.nextId === b.id) return -1;
      if (a.prevId === b.id) return 1;

      return 1;
    });
  }

  async runLeaveProgram(sequenceId: number, user: User) {
    const sequence = await this.sequences.findOneBy({ id: sequenceId });
    if (!sequence) throw new NotFoundException();

    if (sequence.leaveProgram) {
      return this.runProgram(sequence, user);
    }

    return this.playerStates.findOne({
      where: {
        userId: user.id,
      },
    });
  }

  async runProgram(sequence: Sequence, user: User) {
    const playerState = await this.playerStates.findOne({
      where: {
        userId: user.id,
        storyId: sequence.storyId,
      },
    });
    const playerChoice = await this.playerChoices.findOne({
      where: {
        choiceId: sequence.choiceId,
        userId: user.id,
      },
      relations: ['choice', 'option'],
    });

    const variableMap = playerState.toMap();
    const context = new ExecutionContext(
      variableMap,
      sequence,
      playerChoice?.option,
    );

    context.runProgram(sequence.leaveProgram);

    playerState.setState(variableMap);

    return this.playerStates.save(playerState);
  }

  forStoryId(storyId: number): Promise<GraphSequence[]> {
    return this.sequences
      .createQueryBuilder('sequence')
      .leftJoinAndSelect('sequence.router', 'router')
      .leftJoinAndSelect('router.conditions', 'conditions')
      .select([
        'sequence.id',
        'sequence.slug',
        'router.id',
        'router.sequenceId',
        'conditions.sequenceId',
      ])
      .where({ storyId })
      .getMany();
  }
}
