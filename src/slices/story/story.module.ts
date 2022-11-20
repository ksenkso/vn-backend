import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sequence } from '../../entity/Sequence';
import { Story } from '../../entity/Story';
import { SequenceService } from '../sequence/sequence.service';
import { SequenceNode } from '../../entity/SequenceNode';
import { Choice } from '../../entity/Choice';
import { ChoiceOption } from '../../entity/ChoiceOption';
import { PlayerState } from '../../entity/PlayerState';
import { PlayerChoice } from 'src/entity/PlayerChoice';
import { SequenceValidator } from '../sequence/sequence.validator';
import { RouterNode } from '../../entity/RouterNode';
import { StoryValidator } from './story.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Story,
      Sequence,
      SequenceNode,
      RouterNode,
      Choice,
      ChoiceOption,
      PlayerState,
      PlayerChoice,
    ]),
  ],
  controllers: [StoryController],
  providers: [StoryService, SequenceService, SequenceValidator, StoryValidator],
})
export class StoryModule {}
