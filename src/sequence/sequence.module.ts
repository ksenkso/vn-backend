import { Module } from '@nestjs/common';
import { SequenceController } from './sequence.controller';
import { SequenceService } from './sequence.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../entity/Story';
import { Sequence } from '../entity/Sequence';
import { SequenceNode } from '../entity/SequenceNode';
import { Choice } from '../entity/Choice';
import { ChoiceOption } from '../entity/ChoiceOption';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Story,
      Sequence,
      SequenceNode,
      Choice,
      ChoiceOption,
    ]),
  ],
  controllers: [SequenceController],
  providers: [SequenceService],
})
export class SequenceModule {}
