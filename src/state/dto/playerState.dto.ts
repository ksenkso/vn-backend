import { Variable } from '../../lib/types';

export class CreatePlayerStateDto {
  storyId: number;
  state: Record<string, Variable>;
}

export class UpdatePlayerStateDto {
  state: Record<string, Variable>;
}

export class CreateStoryStateDto {
  storyId: number;
  state: Record<string, Variable>;
}
