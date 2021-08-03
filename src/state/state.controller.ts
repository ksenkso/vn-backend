import { Body, Controller, Post } from '@nestjs/common';
import { PlayerStateService } from './player-state.service';
import {
  CreatePlayerStateDto,
  CreateStoryStateDto,
} from './dto/playerState.dto';
import { StoryStateService } from './story-state.service';

@Controller('state')
export class StateController {
  constructor(
    private playerStateService: PlayerStateService,
    private storyStateService: StoryStateService,
  ) {}

  @Post('/player')
  createPlayerState(@Body() playerStateDto: CreatePlayerStateDto) {
    return this.playerStateService.create(playerStateDto);
  }

  @Post('/story')
  createStoryState(@Body() storyStateDto: CreateStoryStateDto) {
    return this.storyStateService.create(storyStateDto);
  }
}
