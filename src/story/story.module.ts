import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sequence } from '../entity/Sequence';
import { Story } from '../entity/Story';

@Module({
  imports: [TypeOrmModule.forFeature([Story, Sequence])],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}
