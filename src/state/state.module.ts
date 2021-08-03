import { Module } from '@nestjs/common';
import { StateController } from './state.controller';
import { PlayerStateService } from './player-state.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerState } from '../entity/PlayerState';
import { StoryState } from '../entity/StoryState';
import { StoryStateService } from './story-state.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerState, StoryState])],
  controllers: [StateController],
  providers: [PlayerStateService, StoryStateService],
})
export class StateModule {}
