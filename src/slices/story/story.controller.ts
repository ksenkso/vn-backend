import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { StoryService } from './story.service';
import { Request } from 'express';
import { User } from '../../entity/user.entity';
import { DataSource } from 'typeorm';
import { OwnerGuard } from '../../guards/owner.guard';
import { Story } from '../../entity/Story';
import { OnlyOwner } from '../../auth/only-owner.decorator';

@Controller('story')
export class StoryController {
  constructor(
    private storyService: StoryService,
    private readonly ds: DataSource,
  ) {}

  @Get()
  getAll() {
    return this.storyService.getAll();
  }

  @Post()
  create(@Req() request: Request, @Body() storyDto: CreateStoryDto) {
    return this.ds.transaction(manager => {
      return this.storyService
        .withTransaction(manager)
        .create(storyDto, request.user as User, manager);
    })

  }

  @Get('/:id')
  get(@Param('id') id: number) {
    return this.storyService.getById(id);
  }

  @UseGuards(OwnerGuard)
  @OnlyOwner(Story)
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
