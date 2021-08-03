import { Injectable } from '@nestjs/common';
import { CreatePlayerStateDto } from './dto/playerState.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerState } from '../entity/PlayerState';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerStateService {
  constructor(
    @InjectRepository(PlayerState)
    private playerStates: Repository<PlayerState>,
  ) {}

  async create(playerStateDto: CreatePlayerStateDto) {
    const state = this.playerStates.create(playerStateDto);

    return this.playerStates.save(state);
  }
}
