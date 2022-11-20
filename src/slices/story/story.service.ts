import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { Story } from '../../entity/Story';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Sequence } from '../../entity/Sequence';
import { SequenceService } from '../sequence/sequence.service';
import { StoryValidator } from './story.validator';
import { User } from '../../entity/user.entity';
import { TransactionFor } from 'nest-transact';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class StoryService extends TransactionFor<StoryService> {
  constructor(
    @InjectRepository(Story)
    private stories: Repository<Story>,
    private sequenceService: SequenceService,
    private storyValidator: StoryValidator,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  getAll(): Promise<Story[]> {
    return this.stories.find();
  }

  getById(id: number): Promise<Story | undefined> {
    return this.stories.findOneBy({ id });
  }

  public async create(
    storyDto: CreateStoryDto,
    user: User,
    manager: EntityManager,
  ) {
    await this.storyValidator.validateCreate(storyDto);

    const story = this.stories.create(storyDto);
    story.owner = user;

    const newStory = await this.stories.save(story);

    newStory.root = await this.sequenceService.withTransaction(manager).createWithoutValidation({
      storyId: newStory.id,
      root: true,
      slug: 'root',
    });

    return newStory;
  }

  async update(id: number, storyDto: UpdateStoryDto): Promise<UpdateResult> {
    await this.storyValidator.validateUpdate(storyDto, id);

    return this.stories.update(id, storyDto);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.stories.delete(id);
  }

  setRoot(storyId: number, sequenceId: number): Promise<UpdateResult> {
    return this.stories.update(storyId, { rootId: sequenceId });
  }

  async getRoot(storyId: number): Promise<Sequence | void> {
    const { rootId } = await this.stories.findOne({ select: ['rootId'], where: { id: storyId } });

    return this.sequenceService.get(rootId);
  }
}
