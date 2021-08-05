import { ExecutionContext } from '../ExecutionContext';
import { BooleanLiteral, NumericLiteral, StringLiteral } from '@babel/types';
import { VariableValue } from '../types';

export class LiteralExecutor {
  static run(
    context: ExecutionContext,
    literal: NumericLiteral | BooleanLiteral | StringLiteral,
  ): VariableValue {
    return literal.value;
  }
}
