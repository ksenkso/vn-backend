import { Module } from '@nestjs/common';
import { SequenceController } from './sequence.controller';
import { SequenceService } from './sequence.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../../entity/Story';
import { Sequence } from '../../entity/Sequence';
import { SequenceNode } from '../../entity/SequenceNode';
import { Choice } from '../../entity/Choice';
import { ChoiceOption } from '../../entity/ChoiceOption';
import { ChoiceService } from '../choice/choice.service';
import { PlayerChoice } from '../../entity/PlayerChoice';
import { PlayerState } from '../../entity/PlayerState';
import { SequenceValidator } from './sequence.validator';
import { RouterNode } from '../../entity/RouterNode';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Story,
      Sequence,
      SequenceNode,
      RouterNode,
      Choice,
      ChoiceOption,
      PlayerChoice,
      PlayerState,
    ]),
  ],
  controllers: [SequenceController],
  providers: [SequenceService, ChoiceService, SequenceValidator],
})
export class SequenceModule {}
