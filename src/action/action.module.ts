import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionNode } from '../entity/ActionNode';
import { PlayerState } from '../entity/PlayerState';

@Module({
  imports: [TypeOrmModule.forFeature([ActionNode, PlayerState])],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
