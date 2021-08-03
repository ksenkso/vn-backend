import { Injectable, PipeTransform } from '@nestjs/common';
import { parse } from '@babel/core';
import traverse from '@babel/traverse';
import { ALLOWED_TYPES } from './lib/utils';
import { InvalidProgramError } from './action/action.service';
import { CreateActionDto } from './action/dto/action.dto';
import { File } from '@babel/types';

@Injectable()
export class ActionPipe implements PipeTransform {
  transform(value: any): CreateActionDto {
    const ast = parse(value.program);
    traverse(ast, {
      enter(node) {
        if (!ALLOWED_TYPES.has(node.type)) {
          throw new InvalidProgramError(node);
        }
      },
    });

    const dto = new CreateActionDto();
    dto.program = ast as File;
    dto.sequenceId = value.sequenceId;
    dto.type = value.type;

    return dto;
  }
}
