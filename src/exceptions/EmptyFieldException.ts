import { BadRequestException } from '@nestjs/common';

export class EmptyFieldException extends BadRequestException {
  constructor(name: string) {
    super(null, `Field ${name} should not be empty`);
  }
}
