export class CreateRouterDto {
  sequenceId: number;
  routes?: Omit<CreateRouteConditionDto, 'routerId'>[];
}

export class CreateRouteConditionDto {
  routerId: number;
  sequenceId: number;
  condition: string;
}
