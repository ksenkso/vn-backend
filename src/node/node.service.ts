import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SequenceNode } from '../entity/SequenceNode';
import {
  CreateNodeDto,
  UpdateNodeDto,
} from '../sequence/dto/sequence-node.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sequence } from '../entity/Sequence';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(SequenceNode)
    private nodes: Repository<SequenceNode>,
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
  ) {}

  async create(nodeDto: CreateNodeDto) {
    if (!nodeDto.prevId) {
      await this.checkRootNodeNotExists(nodeDto);
    }

    const node = this.nodes.create(nodeDto);

    return this.nodes.save(node);
  }

  async update(id: number, nodeDto: UpdateNodeDto) {
    if (!nodeDto.prevId) {
      await this.checkRootNodeNotExists(nodeDto);
    }

    return this.nodes.update(id, nodeDto);
  }

  private async checkRootNodeNotExists(nodeDto: CreateNodeDto | UpdateNodeDto) {
    const sequence = await this.nodes.findOne({
      where: {
        sequenceId: nodeDto.sequenceId,
        prevId: null,
      },
    });

    if (sequence) {
      throw new Error(
        'Should provide prevId when creating a node in a sequence with root node',
      );
    }
  }

  get(id: number) {
    return this.nodes.findOne(id);
  }
}
