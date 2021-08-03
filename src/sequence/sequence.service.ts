import { Injectable } from '@nestjs/common';
import { CreateSequenceDto } from '../story/dto/sequence.dto';
import { Sequence } from '../entity/Sequence';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateNodeDto } from './dto/sequence-node.dto';
import { SequenceNode } from '../entity/SequenceNode';
import { Story } from '../entity/Story';
import {
  CreateChoiceDto,
  CreateChoiceOptionDto,
} from '../choice/dto/choice.dto';
import { Choice } from '../entity/Choice';
import { ChoiceOption } from '../entity/ChoiceOption';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
    @InjectRepository(SequenceNode)
    private nodes: Repository<SequenceNode>,
    @InjectRepository(Story)
    private stories: Repository<Story>,
    @InjectRepository(Choice)
    private choices: Repository<Choice>,
    @InjectRepository(ChoiceOption)
    private choiceOptions: Repository<ChoiceOption>,
  ) {}

  async create(sequenceDto: CreateSequenceDto): Promise<Sequence> {
    const sequence = this.sequences.create(sequenceDto);

    const newSequence = await this.sequences.save(sequence);

    if (sequenceDto.root !== undefined) {
      await this.stories.update(
        {
          id: sequenceDto.storyId,
        },
        {
          rootId: newSequence.id,
        },
      );
    }

    return newSequence;
  }

  async addNode(sequenceId: number, nodeDto: CreateNodeDto) {
    const node = this.nodes.create(nodeDto);
    node.sequenceId = sequenceId;

    return this.nodes.save(node);
  }

  async get(sequenceId: number): Promise<Sequence | void> {
    const nodesQuery = this.nodes.find({
      where: { sequenceId },
      order: {
        order: 'ASC',
      },
    });
    const sequenceQuery = this.sequences.findOne(sequenceId, {
      relations: ['choice', 'choice.options'],
    });
    return Promise.all([nodesQuery, sequenceQuery])
      .then(([nodes, sequence]) => {
        return {
          ...sequence,
          nodes,
        } as Sequence;
      })
      .catch((error) => {
        if (error instanceof QueryFailedError) {
          console.log(error.query, error.parameters);
        }
      });
  }

  async addChoice(sequenceId: number, choiceDto: CreateChoiceDto) {
    const choice = this.choices.create(choiceDto);
    const createdChoice = await this.choices.save(choice);
    await this.sequences.update(sequenceId, { choiceId: createdChoice.id });

    if (choiceDto.options) {
      choiceDto.options.forEach((option: CreateChoiceOptionDto) => {
        option.choiceId = createdChoice.id;
      });
      let options = this.choiceOptions.create(choiceDto.options);
      options = await this.choiceOptions.save(options);

      return {
        ...createdChoice,
        options,
      };
    }

    return createdChoice;
  }
}
