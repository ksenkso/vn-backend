import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionNode } from '../entity/ActionNode';
import { PlayerState } from '../entity/PlayerState';
import { PlayerChoice } from '../entity/PlayerChoice';

@Module({
  imports: [TypeOrmModule.forFeature([ActionNode, PlayerState, PlayerChoice])],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
