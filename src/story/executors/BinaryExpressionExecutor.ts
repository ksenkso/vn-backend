import { ExecutionContext } from '../ExecutionContext';
import { BinaryExpression } from '@babel/types';
import { VariableValue } from '../types';
import { ArithmeticExpressionExecutor } from './ArithmeticExpressionExecutor';
import { ComparisonExpressionExecutor } from './ComparisonExpressionExecutor';
import { locate } from '../utils';

export class BinaryExpressionExecutor {
  static run(
    context: ExecutionContext,
    expression: BinaryExpression,
  ): VariableValue {
    switch (expression.operator) {
      case '+':
      case '-':
      case '/':
      case '%':
      case '*':
      case '**':
        return ArithmeticExpressionExecutor.run(context, expression);
      case '==':
      case '===':
      case '!=':
      case '!==':
      case '>':
      case '<':
      case '>=':
      case '<=':
        return ComparisonExpressionExecutor.run(context, expression);
      default:
        throw new TypeError(
          'Forbidden binary expression at ' + locate(expression.loc),
        );
    }
  }
}
