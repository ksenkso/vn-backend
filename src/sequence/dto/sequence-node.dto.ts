import { IRouteCondition } from '../../entity/RouteCondition';
import { ISequence } from '../../entity/Sequence';

export enum SequenceNodeType {
  Text,
  Sound,
  Animation,
}

export type SequenceNodeDescription =
  | TextNodeDescription
  | SoundNodeDescription;

export class CreateNodeDto {
  sequenceId: number;
  prevId: number;
  type: SequenceNodeType;
  description: SequenceNodeDescription;
}

export class UpdateNodeDto {
  sequenceId?: number;
  nextId?: number;
  prevId?: number;
  type?: SequenceNodeType;
  description?: SequenceNodeDescription;
}

export class TextNodeDescription {
  speaker: string;
  text: string;
}

export class SoundNodeDescription {
  sound: string;
}

export class AnimationNodeDescription {
  order: number;
}

export type GraphSequence = Pick<ISequence, 'id' | 'slug'> & {
  router: GraphRouterNode | null;
};
export type GraphRouterNode = {
  id: number;
  conditions: GraphRouteCondition[];
};
export type GraphRouteCondition = Pick<IRouteCondition, 'sequenceId'>;
