import { Test, TestingModule } from '@nestjs/testing';
import { PlayerStateService } from './player-state.service';

describe('StateService', () => {
  let service: PlayerStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerStateService],
    }).compile();

    service = module.get<PlayerStateService>(PlayerStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
