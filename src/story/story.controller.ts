import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { StoryService } from './story.service';
import { CreateSequenceDto } from './dto/sequence.dto';

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
  get(@Param('id') id: number) {
    return this.storyService.getById(id);
  }

  @Get('/:id/root')
  getRoot(@Param('id') id: number) {
    return this.storyService.getRoot(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() updateStoryDto: UpdateStoryDto) {
    return this.storyService.update(id, updateStoryDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.storyService.delete(id);
  }
}
