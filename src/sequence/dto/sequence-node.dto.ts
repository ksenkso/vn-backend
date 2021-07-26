export enum SequenceNodeType {
  Text,
  Sound,
  Animation,
}

export type SequenceNodeDescription =
  | TextNodeDescription
  | SoundNodeDescription;

export class CreateNodeDto {
  type: SequenceNodeType;
  description: SequenceNodeDescription;
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
