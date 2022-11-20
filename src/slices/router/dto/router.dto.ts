export class CreateRouterDto {
  sequenceId?: number;
  conditions?: Omit<CreateRouteConditionDto, 'routerId'>[];
}

export class CreateRouteConditionDto {
  routerId: number;
  sequenceId: number;
  condition: string;
}
