import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SequenceNode } from '../../entity/SequenceNode';
import { Repository } from 'typeorm';
import { RouterNode } from '../../entity/RouterNode';
import { Sequence } from '../../entity/Sequence';
import { NodeConnectionDto } from '../sequence/dto/sequence-node.dto';
import { EntityNotFoundException } from '../../exceptions/EntityNotFoundException';
import { NodesNotLinkedException } from '../../exceptions/NodesNotLinkedException';
import { NodeRepository } from './node.repository';
import { RouterService } from '../router/router.service';
import { TransactionFor } from 'nest-transact';
import { ModuleRef } from '@nestjs/core';
import { RouteCondition } from '../../entity/RouteCondition';
import { RouteConditionRequiredException } from '../../exceptions/RouteConditionRequiredException';

@Injectable()
export class NodeConnectorService extends TransactionFor<NodeConnectorService> {
  constructor(
    private nodes: NodeRepository,
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
    @InjectRepository(RouterNode)
    private routers: Repository<RouterNode>,
    @InjectRepository(RouteCondition)
    private conditions: Repository<RouteCondition>,
    private routerService: RouterService,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async merge(from: SequenceNode, to: SequenceNode, condition?: string) {
    // First, split nodes destination sequence between `to` node and its ancestor
    const createdSequence = await this.disconnectNodes({ fromId: to.prevId, toId: to.id });
    const cutSequenceId = to.sequenceId;

    // Move the router from split sequence to a new one
    let toSequenceRouter: RouterNode | null = await this.routers
      .findOneBy({
        sequence: {
          id: cutSequenceId
        }
      });

    if (!toSequenceRouter) {
      toSequenceRouter = await this.routerService.create({ sequenceId: cutSequenceId });
    }

    createdSequence.router = toSequenceRouter;
    await this.sequences.save(createdSequence);

    let fromSequenceRouter = await this.routers
      .findOneBy({
        sequence: {
          id: from.sequenceId,
        }
      });

    if (!fromSequenceRouter) {
      fromSequenceRouter = await this.routerService.create({ sequenceId: from.sequenceId });
    }

    const conditionsCount = await this.conditions.count({
      where: {
        routerId: fromSequenceRouter.id,
      }
    });

    if (conditionsCount) {
      if (!condition) {
        throw new RouteConditionRequiredException();
      }
      await this.routerService.addRoute()
    }

    // Replace the router of cut sequence with a new one
    // with default route to new sequence
    await this.routerService.createWithDefaultRoute(
      cutSequenceId,
      createdSequence.id,
    );

    return createdSequence;
  }

  async push(from: SequenceNode, to: SequenceNode) {
  //
  }

  async link(from: SequenceNode, to: SequenceNode) {
  //
  }

  async disconnectNodes(dto: NodeConnectionDto) {
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
