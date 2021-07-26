import { Module } from '@nestjs/common';
import { SequenceController } from './sequence.controller';
import { SequenceService } from './sequence.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../entity/Story';
import { Sequence } from '../entity/Sequence';
import { SequenceNode } from '../entity/SequenceNode';

@Module({
  imports: [TypeOrmModule.forFeature([Story, Sequence, SequenceNode])],
  controllers: [SequenceController],
  providers: [SequenceService],
})
export class SequenceModule {}
