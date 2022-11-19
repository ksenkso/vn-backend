import { Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SequenceNode } from 'src/entity/SequenceNode';
import { Sequence } from '../../entity/Sequence';
import { NodeValidator } from './node.validator';

@Module({
  controllers: [NodeController],
  providers: [NodeService, NodeValidator],
  imports: [TypeOrmModule.forFeature([SequenceNode, Sequence])],
})
export class NodeModule {}
