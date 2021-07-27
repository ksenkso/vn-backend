export class CreateStoryDto {
  name: string;
  rootId?: number;
}

export class UpdateStoryDto {
  name?: string;
  rootId?: number;
}
