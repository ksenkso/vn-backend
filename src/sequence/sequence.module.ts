import { Module } from '@nestjs/common';
import { SequenceController } from './sequence.controller';
import { SequenceService } from './sequence.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../entity/Story';
import { Sequence } from '../entity/Sequence';

@Module({
  imports: [TypeOrmModule.forFeature([Story, Sequence])],
  controllers: [SequenceController],
  providers: [SequenceService],
})
export class SequenceModule {}
