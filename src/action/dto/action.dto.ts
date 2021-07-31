import { ActionNodeType } from '../../entity/ActionNode';

export class CreateActionDto {
  sequenceId: number;
  type: ActionNodeType;
  program: string;
}

export class UpdateActionDto {
  sequenceId?: number;
  type?: ActionNodeType;
  program?: string;
}
