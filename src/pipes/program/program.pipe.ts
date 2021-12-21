import { Injectable, PipeTransform } from '@nestjs/common';
import { NodePath, parse } from '@babel/core';
import traverse from '@babel/traverse';
import { ALLOWED_TYPES } from '../../lib/utils';
import { File } from '@babel/types';

export class InvalidProgramError extends Error {
  public statusCode = 422;
  public message = 'Incorrect program';

  constructor(public readonly node: NodePath) {
    super();
  }
}

@Injectable()
export class ProgramPipe implements PipeTransform {
  transform(value: any): File {
    const sources = [value.enterProgram, value.leaveProgram];
    if (!sources.filter(Boolean).length) return value;

    const [enterProgram, leaveProgram] = sources.map((program) => {
      if (!program) return null;

      const ast = parse(program);
      traverse(ast, {
        enter(node) {
          if (!ALLOWED_TYPES.has(node.type)) {
            throw new InvalidProgramError(node);
          }
        },
      });

      return ast as File;
    });

    value.enterProgram = enterProgram;
    value.leaveProgram = leaveProgram;

    return value;
  }
}
