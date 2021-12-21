import { Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SequenceNode } from 'src/entity/SequenceNode';
import { Sequence } from '../entity/Sequence';

@Module({
  controllers: [NodeController],
  providers: [NodeService],
  imports: [TypeOrmModule.forFeature([SequenceNode, Sequence])],
})
export class NodeModule {}
