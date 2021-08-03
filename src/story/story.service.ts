import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Story } from '../entity/Story';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { CreateSequenceDto } from './dto/sequence.dto';
import { Sequence } from '../entity/Sequence';
import { SequenceService } from '../sequence/sequence.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(Sequence)
    private sequenceRepository: Repository<Sequence>,
    private sequenceService: SequenceService,
  ) {}

  getById(id: number): Promise<Story | undefined> {
    return this.storyRepository.findOne(id);
  }

  create(storyDto: CreateStoryDto): Promise<Story> {
    const story = this.storyRepository.create(storyDto);

    return this.storyRepository.save(story);
  }

  update(id: number, storyDto: UpdateStoryDto): Promise<UpdateResult> {
    // potential bug: sequence can be in a different story, so check needed
    return this.storyRepository.update(id, storyDto);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.storyRepository.delete(id);
  }

  addSequence(sequenceDto: CreateSequenceDto): Promise<Sequence> {
    const sequence = this.sequenceRepository.create(sequenceDto);

    return this.sequenceRepository.save(sequence);
  }

  setRoot(storyId: number, sequenceId: number): Promise<UpdateResult> {
    return this.storyRepository.update(storyId, { rootId: sequenceId });
  }

  async getRoot(storyId: number): Promise<Sequence | void> {
    const story = await this.storyRepository.findOne(storyId);

    return this.sequenceService.get(story.rootId);
  }
}
