import { ActionNodeType } from '../../entity/ActionNode';
import { File } from '@babel/types';

export class CreateActionDto {
  sequenceId: number;
  type: ActionNodeType;
  program: File;
}

export class UpdateActionDto {
  sequenceId?: number;
  type?: ActionNodeType;
  program?: string;
}
