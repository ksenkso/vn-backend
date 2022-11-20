import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from '../../entity/Story';
import { Repository } from 'typeorm';
import { Sequence } from '../../entity/Sequence';
import { DtoValidator, IDtoValidator } from '../../lib/DtoValidator';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { EmptyFieldException } from '../../exceptions/EmptyFieldException';

@Injectable()
export class StoryValidator implements IDtoValidator<CreateStoryDto, UpdateStoryDto>{
  public readonly storyValidator: DtoValidator<Story>;
  public readonly sequenceValidator: DtoValidator<Sequence>;

  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(Sequence)
    private sequenceRepository: Repository<Sequence>,
  ) {
    this.storyValidator = new DtoValidator(storyRepository);
    this.sequenceValidator = new DtoValidator(sequenceRepository);
  }

  async validateCreate(dto: CreateStoryDto) {
    const name = dto.name.trim();
    if (!name) {
      throw new EmptyFieldException('name');
    }

    await this.storyValidator.notExistsWhere({ name });
  }

  async validateUpdate(dto: UpdateStoryDto, storyId: number) {
    await this.sequenceValidator.existsWhere({ id: dto.rootId, storyId });
  }
}
