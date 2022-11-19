import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SequenceNode } from '../../entity/SequenceNode';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '../../exceptions/EntityNotFoundException';
import { CreateNodeDto, UpdateNodeDto } from '../sequence/dto/sequence-node.dto';
import { Sequence } from '../../entity/Sequence';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { EntityAlreadyExistsException } from '../../exceptions/EntityAlreadyExistsException';
import { NodeAlreadyLinkedException } from '../../exceptions/NodeAlreadyLinkedException';

class DtoValidator<Entity> {
  constructor(private repo: Repository<Entity>) {
  }

  async existsWithId(id: number | string) {
    const entity = await this.repo.findOne(id);

    if (!entity) {
      throw EntityNotFoundException.withId(this.repo.metadata.name, id);
    }

    return entity;
  }

  async notExistsWithId(id: number | string) {
    const entity = await this.repo.findOne(id);

    if (entity) {
      throw EntityAlreadyExistsException.withId(this.repo.metadata.name, id);
    }
  }

  async existsWhere(where?: FindOneOptions<Entity>['where']) {
    const entity = await this.repo.findOne({ where });

    if (!entity) {
      throw EntityNotFoundException.withParams(this.repo.metadata.name, JSON.stringify(where));
    }

    return entity;
  }

  async notExistsWhere(where?: FindOneOptions<Entity>['where']) {
    const entity = await this.repo.findOne({ where });

    if (!entity) {
      throw EntityAlreadyExistsException.withParams(this.repo.metadata.name, JSON.stringify(where));
    }
  }

}

interface IDtoValidator<CreateDto, UpdateDto> {
  validateCreate(dto: CreateDto): Promise<void>;
  validateUpdate(dto: UpdateDto): Promise<void>;
}

@Injectable()
export class NodeValidator implements IDtoValidator<CreateNodeDto, UpdateNodeDto> {
  private validator: DtoValidator<SequenceNode>;

  constructor(
    @InjectRepository(SequenceNode)
    private repo: Repository<SequenceNode>,
    @InjectRepository(Sequence)
    private sequences: Repository<Sequence>,
  ) {
    this.validator = new DtoValidator(repo);
  }

  async validateCreate(dto: CreateNodeDto | UpdateNodeDto): Promise<void> {
    if (!dto.prevId) {
      await this.validator.notExistsWhere({
        sequenceId: dto.sequenceId,
        prevId: null,
      });
    }

    if (dto.prevId) {
      const prevNode = await this.validator.existsWithId(dto.prevId);

      if (prevNode.nextId) {
        throw NodeAlreadyLinkedException.between(dto.prevId, prevNode.nextId);
      }
    }

    if (dto.nextId) {
      await this.validator.existsWithId(dto.nextId);
    }
  }

  validateUpdate(dto) {
    return this.validateCreate(dto);
  }
}
