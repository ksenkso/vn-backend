import { Module } from '@nestjs/common';
import { SequenceController } from './sequence.controller';
import { SequenceService } from './sequence.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../../entity/Story';
import { Sequence } from '../../entity/Sequence';
import { Choice } from '../../entity/Choice';
import { ChoiceOption } from '../../entity/ChoiceOption';
import { ChoiceService } from '../choice/choice.service';
import { PlayerChoice } from '../../entity/PlayerChoice';
import { PlayerState } from '../../entity/PlayerState';
import { SequenceValidator } from './sequence.validator';
import { RouterNode } from '../../entity/RouterNode';
import { TypeOrmExModule } from '../../typeorm/typeorm-ex.module';
import { NodeRepository } from '../node/node.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Story,
      Sequence,
      RouterNode,
      Choice,
      ChoiceOption,
      PlayerChoice,
      PlayerState,
    ]),
    TypeOrmExModule.forCustomRepository([NodeRepository]),
  ],
  controllers: [SequenceController],
  providers: [SequenceService, ChoiceService, SequenceValidator],
})
export class SequenceModule {}
