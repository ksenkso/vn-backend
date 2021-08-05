import { Module } from '@nestjs/common';
import { SequenceController } from './sequence.controller';
import { SequenceService } from './sequence.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../entity/Story';
import { Sequence } from '../entity/Sequence';
import { SequenceNode } from '../entity/SequenceNode';
import { Choice } from '../entity/Choice';
import { ChoiceOption } from '../entity/ChoiceOption';
import { ChoiceService } from '../choice/choice.service';
import { PlayerChoice } from '../entity/PlayerChoice';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Story,
      Sequence,
      SequenceNode,
      Choice,
      ChoiceOption,
      PlayerChoice,
    ]),
  ],
  controllers: [SequenceController],
  providers: [SequenceService, ChoiceService],
})
export class SequenceModule {}
