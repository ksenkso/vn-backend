import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SequenceNode } from '../../entity/SequenceNode';
import { CreateNodeDto, UnlinkNodesDto, UpdateNodeDto } from '../sequence/dto/sequence-node.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sequence } from '../../entity/Sequence';
import { EntityNotFoundException } from '../../exceptions/EntityNotFoundException';
import { NodeValidator } from './node.validator';
import { NodesNotLinkedException } from '../../exceptions/NodesNotLinkedException';
import { DtoValidator } from '../../lib/DtoValidator';
import { TransactionFor } from 'nest-transact';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class NodeService extends TransactionFor<NodeService> {
  private nodeValidator: DtoValidator<SequenceNode>;
  constructor(
    @InjectRepository(SequenceNode)
    private nodes: Repository<SequenceNode>,
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
    private nodeDtoValidator: NodeValidator,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
    this.nodeValidator = this.nodeDtoValidator.getValidator();
  }

  async create(nodeDto: CreateNodeDto) {
    await this.nodeDtoValidator.validateCreate(nodeDto);

    const node = this.nodes.create(nodeDto);

    const created = await this.nodes.save(node);

    if (node.prevId) {
      await this.nodes.update({ id: node.prevId }, { nextId: created.id })
    }

    if (node.nextId) {
      await this.nodes.update({ id: node.nextId }, { prevId: created.id });
    }

    return created;
  }

  async update(id: number, nodeDto: UpdateNodeDto) {
    await this.nodeDtoValidator.validateUpdate(nodeDto);

    const node = await this.nodes.findOneBy({ id });
    await this.nodes.update(id, nodeDto);

    if (nodeDto.prevId) {
      await this.nodes.update({ id: node.prevId }, { nextId: null })
    }

    if (node.nextId) {
      await this.nodes.update({ id: node.nextId }, { prevId: null });
    }

    return this.nodes.findOneBy({ id });
  }

  get(id: number) {
    return this.nodes.findOneBy({ id });
  }

  async delete(id: number) {
    const node = await this.nodes.findOneBy({ id });

    if (!node) {
      throw EntityNotFoundException.withId('Node', id);
    }

    if (node.prevId) {
      await this.nodes.update({ id: node.prevId }, { nextId: node.nextId });
    }

    if (node.nextId) {
      await this.nodes.update({ id: node.nextId }, { prevId: node.prevId });
    }

    await this.nodes.delete({ id });
  }

  async unlink(dto: UnlinkNodesDto) {
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
    const nodesToUpdate = (await this.getList(dto.toId)).map(node => node.id);

    await this.nodes
      .createQueryBuilder('nodes')
      .update()
      .set({ sequenceId: savedSequence.id })
      .whereInIds(nodesToUpdate)
      .execute();

    return savedSequence;
  }

  async link(fromId: number, toId: number) {
    const fromNode = await this.nodeValidator.requireOne(fromId);
    const toNode = await this.nodeValidator.requireOne(toId);

    if (fromNode.nextId || toNode.prevId) {

    }
  }

  async getList(fromId: number): Promise<SequenceNode[]> {
    const sql = `WITH RECURSIVE traverse_list AS (
      SELECT sequence_node.*
      FROM sequence_node
      WHERE "sequence_node"."id" = $1
      UNION all
      SELECT
          sn.*
      FROM sequence_node sn
      JOIN traverse_list ON ("sn"."prevId" = "traverse_list"."id")
      )
      SELECT * FROM traverse_list;`

    return await this.nodes.query(sql, [fromId]);
  }
}
