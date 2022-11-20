import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SequenceNode } from '../../entity/SequenceNode';
import { Repository } from 'typeorm';
import { RouterNode } from '../../entity/RouterNode';
import { Sequence } from '../../entity/Sequence';
import { DisconnectNodesDto } from '../sequence/dto/sequence-node.dto';
import { EntityNotFoundException } from '../../exceptions/EntityNotFoundException';
import { NodesNotLinkedException } from '../../exceptions/NodesNotLinkedException';
import { NodeRepository } from './node.repository';

@Injectable()
export class NodeConnectorService {
  constructor(
    private nodes: NodeRepository,
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
    @InjectRepository(RouterNode)
    private routers: Repository<RouterNode>,
  ) {
  }

  async merge(from: SequenceNode, to: SequenceNode) {
  //
  }

  async push(from: SequenceNode, to: SequenceNode) {
  //
  }

  async link(from: SequenceNode, to: SequenceNode) {
  //
  }

  async disconnectNodes(dto: DisconnectNodesDto) {
    const fromNode = await this.nodes.findOneBy({ id: dto.fromId });
    const toNode = await this.nodes.findOneBy({ id: dto.toId });

    if (!fromNode) {
      throw EntityNotFoundException.withId(this.nodes.metadata.name, dto.fromId);
    }

    if (!toNode) {
      throw EntityNotFoundException.withId(this.nodes.metadata.name, dto.toId);
    }

    if (fromNode.nextId !== toNode.id || toNode.prevId !== fromNode.id) {
      throw new NodesNotLinkedException(fromNode, toNode);
    }

    // unlink nodes
    await this.nodes.update({ id: dto.fromId }, { nextId: null });
    await this.nodes.update({ id: dto.toId }, { prevId: null });

    // create new sequence for a detached node
    const { sequenceId } = await this.nodes.findOne({ select: ['sequenceId'], where: { id: dto.toId } });
    const { storyId } = await this.sequences.findOne({ select: ['storyId'], where: { id: sequenceId } });
    const slug = `auto-${storyId}-for-${dto.toId}`;

    const newSequence = this.sequences.create({ storyId, slug });
    const savedSequence = await this.sequences.save(newSequence);
    // update all descendant nodes
    const nodesToUpdate = (await this.nodes.getList(dto.toId)).map(node => node.id);

    await this.nodes
      .createQueryBuilder('nodes')
      .update()
      .set({ sequenceId: savedSequence.id })
      .whereInIds(nodesToUpdate)
      .execute();

    return savedSequence;
  }
}
