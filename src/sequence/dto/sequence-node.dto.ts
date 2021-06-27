export enum SequenceNodeType {
  Text,
  Sound,
  Animation,
}

export class CreateNodeDto {
  type: SequenceNodeType;
  description: CreateTextNodeDto | CreateSoundNodeDto | CreateAnimationNodeDto;
}

export class CreateTextNodeDto {}

export class CreateSoundNodeDto {}

export class CreateAnimationNodeDto {}
