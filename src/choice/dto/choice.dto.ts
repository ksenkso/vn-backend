export class CreateChoiceDto {
  title: string;
  options?: Omit<CreateChoiceOptionDto, 'choiceId'>[];
}

export class UpdateChoiceDto {
  title: string;
}

export class CreateChoiceOptionDto {
  title: string;
  choiceId: number;
}

export class UpdateChoiceOptionDto {
  title: string;
}
