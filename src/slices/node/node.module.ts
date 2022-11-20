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
import { RouterService } from '../router/router.service';
import { RouteCondition } from '../../entity/RouteCondition';
import { PlayerChoice } from '../../entity/PlayerChoice';
import { PlayerState } from '../../entity/PlayerState';

@Module({
  controllers: [NodeController],
  providers: [NodeService, NodeValidator, NodeConnectorService, RouterService],
  imports: [
    TypeOrmModule.forFeature([Sequence, RouterNode, RouteCondition, PlayerChoice, PlayerState]),
    TypeOrmExModule.forCustomRepository([NodeRepository]),
  ],
})
export class NodeModule {}
