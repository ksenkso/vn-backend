import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  static withId(entity: string, id: number | string): EntityNotFoundException {
    return new EntityNotFoundException(
      null,
      `${entity} with id ${id} not found`
    );
  }

  static withParams(entity: string, options: any) {
    return new EntityNotFoundException(
      null,
      `${entity} with options object ${JSON.stringify(options)} not found`
    );
  }
}
