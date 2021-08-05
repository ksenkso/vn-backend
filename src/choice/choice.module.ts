import { Module } from '@nestjs/common';
import { ChoiceController } from './choice.controller';
import { ChoiceService } from './choice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Choice } from '../entity/Choice';
import { ChoiceOption } from '../entity/ChoiceOption';
import { Sequence } from '../entity/Sequence';
import { PlayerChoice } from '../entity/PlayerChoice';

@Module({
  imports: [
    TypeOrmModule.forFeature([Choice, ChoiceOption, Sequence, PlayerChoice]),
  ],
  controllers: [ChoiceController],
  providers: [ChoiceService],
})
export class ChoiceModule {}
