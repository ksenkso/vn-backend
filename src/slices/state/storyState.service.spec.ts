import { Test, TestingModule } from '@nestjs/testing';
import { StoryStateService } from './story-state.service';

describe('StoryStateService', () => {
  let service: StoryStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoryStateService],
    }).compile();

    service = module.get<StoryStateService>(StoryStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
