import { ExecutionContext } from '../ExecutionContext';
import { LogicalExpression } from '@babel/types';
import { VariableValue } from '../types';
import { locate } from '../utils';
import { ExpressionExecutor } from './ExpressionExecutor';

export class LogicExecutor {
  static run(
    context: ExecutionContext,
    expression: LogicalExpression,
  ): VariableValue {
    const left = ExpressionExecutor.run(context, expression.left);
    const right = ExpressionExecutor.run(context, expression.right);
    switch (expression.operator) {
      case '&&':
        return left && right;
      case '||':
        return left || right;
      default:
        throw new TypeError(
          'Forbidden logical operator at ' + locate(expression.loc),
        );
    }
  }
}
