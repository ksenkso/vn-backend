import { DtoValidator, IDtoValidator } from '../../lib/DtoValidator';
import { CreateSequenceDto, UpdateSequenceDto } from '../story/dto/sequence.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sequence } from '../../entity/Sequence';
import { Story } from '../../entity/Story';

@Injectable()
export class SequenceValidator implements IDtoValidator<CreateSequenceDto, UpdateSequenceDto> {
  public readonly validator: DtoValidator<Sequence>;
  public readonly storyValidator: DtoValidator<Story>;

  constructor(
    @InjectRepository(Sequence)
    private repo: Repository<Sequence>,
    @InjectRepository(Story)
    private storyRepo: Repository<Story>,
  ) {
    this.validator = new DtoValidator(repo);
    this.storyValidator = new DtoValidator(storyRepo);
  }

  async validateCreate(dto) {
    await this.storyValidator.requireOne(dto.storyId);
  }

  async validateUpdate(dto) {
    await this.storyValidator.requireOne(dto.storyId);
  }
}
