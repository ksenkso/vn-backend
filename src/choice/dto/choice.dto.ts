export class ChoiceCreateDto {
  title: string;
  sequenceId: number;
  options?: Omit<ChoiceOptionCreateDto, 'choiceId'>[];
}

export class ChoiceUpdateDto {
  title: string;
}

export class ChoiceOptionCreateDto {
  title: string;
  choiceId: number;
}

export class ChoiceOptionUpdateDto {
  title: string;
}
