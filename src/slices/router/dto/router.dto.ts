export class CreateRouterDto {
  conditions?: Omit<CreateRouteConditionDto, 'routerId'>[];
}

export class CreateRouteConditionDto {
  routerId: number;
  sequenceId: number;
  condition: string;
}
