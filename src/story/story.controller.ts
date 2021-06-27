import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateStoryDto } from './dto/story.dto';
import { StoryService } from './story.service';
import { CreateSequenceDto } from './dto/sequence.dto';
import { ObjectID } from 'typeorm';

@Controller('story')
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Post()
  create(@Body() storyDto: CreateStoryDto) {
    return this.storyService.create(storyDto);
  }

  @Post('/:id/sequence')
  addStory(@Body() sequenceDto: CreateSequenceDto) {
    return this.storyService.addSequence(sequenceDto);
  }

  @Get('/:id')
  get(@Param('id') id: ObjectID) {
    return this.storyService.getById(id);
  }
}
