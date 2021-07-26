import { Injectable } from '@nestjs/common';
import { CreateSequenceDto } from '../story/dto/sequence.dto';
import { Sequence } from '../entity/Sequence';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNodeDto } from './dto/sequence-node.dto';
import { SequenceNode } from '../entity/SequenceNode';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,

    @InjectRepository(SequenceNode)
    private nodes: Repository<SequenceNode>,
  ) {}

  create(sequenceDto: CreateSequenceDto): Promise<Sequence> {
    const sequence = this.sequences.create(sequenceDto);

    return this.sequences.save(sequence);
  }

  async addNode(sequenceId: number, nodeDto: CreateNodeDto) {
    const node = this.nodes.create(nodeDto);
    node.sequenceId = sequenceId;

    return this.nodes.save(node);
  }

  async get(sequenceId: number) {
    return this.sequences
      .createQueryBuilder('sequence')
      .where({ id: sequenceId })
      .leftJoinAndSelect('sequence.nodes', 'node')
      .orderBy('node.order', 'ASC')
      .getOne();
  }
}
