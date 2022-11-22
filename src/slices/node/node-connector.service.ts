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
import { parse } from '@babel/parser';

@Injectable()
export class NodeConnectorService extends TransactionFor<NodeConnectorService> {
  private static DEFAULT_ROUTE_CONDITION = 'true';

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
    const fromSequenceRouter = await this.routerService.getOrCreateForSequence(from.sequenceId);
    await this.requireConditionIfHasRoutes(fromSequenceRouter.id, condition);

    // First, split nodes destination sequence between `to` node and its ancestor
    const createdSequence = await this.disconnectNodes({ fromId: to.prevId, toId: to.id });
    const splitSequenceId = to.sequenceId;

    // Move the router from split sequence to a new one
    createdSequence.router = await this.routerService.getOrCreateForSequence(splitSequenceId);
    await this.sequences.save(createdSequence);

    // Replace the router of split sequence with a new one
    // with default route to new sequence
    const splitSequenceRouter = await this.routerService.create({ sequenceId: splitSequenceId });
    await this.link(splitSequenceRouter, createdSequence);
    const link = await this.link(fromSequenceRouter, createdSequence, condition);

    return {
      createdSequence: {
        id: createdSequence.id,
        router: createdSequence.router,
      },
      splitSequence: {
        id: splitSequenceId,
        router: splitSequenceRouter,
      },
      link,
    };
  }

  /**
   * If `from` node's sequence has a router with defined non-default routes,
   * user should provide a condition for a route being created with merge
   */
  private async requireConditionIfHasRoutes(routerId: number, condition?: string) {
    const conditionsCount = await this.conditions.count({
      where: {
        routerId,
      }
    });

    if (conditionsCount && !condition) {
      throw new RouteConditionRequiredException();
    }
  }

  async move(from: SequenceNode, to: SequenceNode) {
    // Connect last node from first sequence to the first node of the second sequence
    await this.nodes.update({ id: from.id }, { nextId: to.id });
    await this.nodes.update({ id: to.id }, { prevId: from.id });

    // Move all nodes from the first sequence to the second sequence
    await this.nodes.update({ sequenceId: from.id }, { sequenceId: to.id });

    // Clean up the first sequence
    await this.conditions.update({ sequenceId: from.id }, { sequenceId: to.id });
    const { routerId } = await this.sequences.findOne({ select: ['routerId'], where: { id: from.id } });
    await this.routers.delete({ id: routerId });
    await this.sequences.delete({ id: from.id });
  }

  async linkNodes(from: SequenceNode, to: SequenceNode, condition?: string) {
    const fromSequenceRouter = await this.routerService.getOrCreateForSequence(from.sequenceId);
    const toSequence = await this.sequences.findOneBy({ id: to.sequenceId });

    return this.link(fromSequenceRouter, toSequence, condition)
  }

  async link(from: RouterNode, to: Sequence, condition = NodeConnectorService.DEFAULT_ROUTE_CONDITION) {
    const route = this.conditions.create({
      routerId: from.id,
      sequenceId: to.id,
      condition: parse(condition),
      text: condition,
    });

    const saved = await this.conditions.save(route);

    if (from.conditions) {
      from.conditions.push(saved);
    } else {
      from.conditions = [saved];
    }

    return saved;
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
