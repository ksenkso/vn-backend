import { ExecutionContext } from '../ExecutionContext';
import { UpdateExpression } from '@babel/types';
import { locate, Types } from '../utils';

export class UpdateExecutor {
  static run(context: ExecutionContext, expression: UpdateExpression) {
    if (expression.argument.type !== Types.Identifier) {
      throw new TypeError(
        'Cannot update non-identifier at ' + locate(expression.loc),
      );
    }
    const variable = context.getVariable(expression.argument);

    switch (expression.operator) {
      case '++':
        return (variable.value as number)++;
      case '--':
        return (variable.value as number)--;
      default:
        throw new TypeError(
          'Invalid update operation at ' + locate(expression.loc),
        );
    }
  }
}
