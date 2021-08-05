export class CreateChoiceDto {
  sequenceId: number;
  title: string;
  slug?: string;
  options?: Omit<CreateChoiceOptionDto, 'choiceId'>[];
}

export class UpdateChoiceDto {
  title: string;
  slug?: string;
}

export class CreateChoiceOptionDto {
  slug: string;
  title: string;
  choiceId: number;
}

export class UpdateChoiceOptionDto {
  title?: string;
  slug?: string;
}

export class CreatePlayerChoiceDto {
  choiceId: number;
  optionId: number;
}
