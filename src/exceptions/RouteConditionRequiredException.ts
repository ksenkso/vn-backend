import { BadRequestException } from '@nestjs/common';

export class RouteConditionRequiredException extends BadRequestException {
  constructor() {
    super(null, 'You should provide a condition to create this route.');
  }
}
