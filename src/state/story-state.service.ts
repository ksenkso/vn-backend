import { Injectable } from '@nestjs/common';
import { CreateStoryStateDto } from './dto/playerState.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryState } from '../entity/StoryState';

@Injectable()
export class StoryStateService {
  constructor(
    @InjectRepository(StoryState)
    private storyStates: Repository<StoryState>,
  ) {}

  async create(playerStateDto: CreateStoryStateDto) {
    const state = this.storyStates.create(playerStateDto);

    return this.storyStates.save(state);
  }
}
