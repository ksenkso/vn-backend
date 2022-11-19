import { File } from '@babel/types';

export class CreateSequenceDto {
  slug: string;
  storyId: number;
  root?: boolean;
  enterProgram?: File;
  leaveProgram?: File;
}

export class UpdateSequenceDto {
  slug?: string;
  root?: boolean;
  enterProgram?: File;
  leaveProgram?: File;
}
