import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';

export class EntityAlreadyExistsException extends ConflictException {
  static withId(entity: string, id: number | string): EntityAlreadyExistsException {
    return new EntityAlreadyExistsException(
      null,
      `${entity} with id ${id} already exists`
    );
  }

  static withParams(entity: string, options: any) {
    return new EntityAlreadyExistsException(
      null,
      `${entity} with options object ${JSON.stringify(options)} already exists`
    );
  }
}
