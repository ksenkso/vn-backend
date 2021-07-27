export class CreateSequenceDto {
  slug: string;
  storyId: number;
  root?: boolean;
}

export class UpdateSequenceDto {
  slug: string;
  root?: boolean;
}
