import { VariableComparator, VariableValue } from '../types';
import { BinaryExpression, Expression } from '@babel/types';
import { locate } from '../utils';
import { ExecutionContext } from '../ExecutionContext';
import { ExpressionExecutor } from './ExpressionExecutor';

export class ComparisonExpressionExecutor {
  static check(
    left: VariableValue,
    right: VariableValue,
    comparator: VariableComparator,
  ): boolean {
    return comparator(left, right);
  }

  static getComparator(expression: BinaryExpression): VariableComparator {
    switch (expression.operator) {
      case '==':
        return (a, b) => a == b;
      case '===':
        return (a, b) => a === b;
      case '!=':
        return (a, b) => a != b;
      case '!==':
        return (a, b) => a !== b;
      case '>':
        return (a, b) => a > b;
      case '<':
        return (a, b) => a < b;
      case '>=':
        return (a, b) => a >= b;
      case '<=':
        return (a, b) => a <= b;
      default:
        throw new TypeError(
          'Forbidden binary expression at ' + locate(expression.loc),
        );
    }
  }

  static run(context: ExecutionContext, expression: BinaryExpression): boolean {
    const left: Expression =
      expression.left.type === 'PrivateName'
        ? expression.left.id
        : expression.left;
    const right: Expression = expression.right;
    return this.check(
      ExpressionExecutor.run(context, left),
      ExpressionExecutor.run(context, right),
      this.getComparator(expression),
    );
  }
}
