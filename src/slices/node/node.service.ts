import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SequenceNode } from '../../entity/SequenceNode';
import { CreateNodeDto, DisconnectNodesDto, UpdateNodeDto } from '../sequence/dto/sequence-node.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sequence } from '../../entity/Sequence';
import { EntityNotFoundException } from '../../exceptions/EntityNotFoundException';
import { NodeValidator } from './node.validator';
import { DtoValidator } from '../../lib/DtoValidator';
import { TransactionFor } from 'nest-transact';
import { ModuleRef } from '@nestjs/core';
import { NodeConnectorService } from './node-connector.service';
import { NodeRepository } from './node.repository';

@Injectable()
export class NodeService extends TransactionFor<NodeService> {
  private nodeValidator: DtoValidator<SequenceNode>;
  constructor(
    private nodes: NodeRepository,
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
    private nodeConnector: NodeConnectorService,
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

  async connectNodes(fromId: number, toId: number) {
    const fromNode = await this.nodeValidator.requireOne(fromId);
    const toNode = await this.nodeValidator.requireOne(toId);

    if (fromNode.nextId || toNode.prevId) {

    }
  }

  disconnectNodes(disconnectNodesDto: DisconnectNodesDto) {
    return this.nodeConnector.disconnectNodes(disconnectNodesDto);
  }

  getList(fromId: number) {
    return this.nodes.getList(fromId);
  }
}
