import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SequenceNode } from '../../entity/SequenceNode';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNodeDto, UpdateNodeDto } from '../sequence/dto/sequence-node.dto';
import { NodeAlreadyLinkedException } from '../../exceptions/NodeAlreadyLinkedException';
import { DtoValidator, IDtoValidator } from '../../lib/DtoValidator';

@Injectable()
export class NodeValidator implements IDtoValidator<CreateNodeDto, UpdateNodeDto> {
  public readonly validator: DtoValidator<SequenceNode>;

  constructor(
    @InjectRepository(SequenceNode)
    private repo: Repository<SequenceNode>,
  ) {
    this.validator = new DtoValidator(repo);
  }

  getValidator() {
    return this.validator;
  }

  async validateCreate(dto: CreateNodeDto | UpdateNodeDto): Promise<void> {
    if (!dto.prevId) {
      await this.validator.notExistsWhere({
        sequenceId: dto.sequenceId,
        prevId: null,
      });
    }

    if (dto.prevId) {
      const prevNode = await this.validator.requireOne(dto.prevId);

      if (prevNode.nextId) {
        throw NodeAlreadyLinkedException.between(dto.prevId, prevNode.nextId);
      }
    }

    if (dto.nextId) {
      await this.validator.requireOne(dto.nextId);
    }
  }

  validateUpdate(dto) {
    return this.validateCreate(dto);
  }
}
