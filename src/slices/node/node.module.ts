import { Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sequence } from '../../entity/Sequence';
import { NodeValidator } from './node.validator';
import { TypeOrmExModule } from '../../typeorm/typeorm-ex.module';
import { NodeRepository } from './node.repository';
import { NodeConnectorService } from './node-connector.service';
import { RouterNode } from '../../entity/RouterNode';

@Module({
  controllers: [NodeController],
  providers: [NodeService, NodeValidator, NodeConnectorService],
  imports: [
    TypeOrmModule.forFeature([Sequence, RouterNode]),
    TypeOrmExModule.forCustomRepository([NodeRepository]),
  ],
})
export class NodeModule {}
