import { ExecutionContext } from '../ExecutionContext';
import { BooleanLiteral, NumericLiteral } from '@babel/types';
import { VariableValue } from '../types';

export class LiteralExecutor {
  static run(
    context: ExecutionContext,
    literal: NumericLiteral | BooleanLiteral,
  ): VariableValue {
    return literal.value;
  }
}
