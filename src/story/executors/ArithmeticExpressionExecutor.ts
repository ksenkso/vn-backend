import { VariableOperator, VariableValue } from '../types';
import { BinaryExpression, Expression } from '@babel/types';
import { locate } from '../utils';
import { ExecutionContext } from '../ExecutionContext';
import { ExpressionExecutor } from './ExpressionExecutor';

export class ArithmeticExpressionExecutor {
  static check(
    left: VariableValue,
    right: VariableValue,
    operator: VariableOperator,
  ): VariableValue {
    return operator(left, right);
  }

  static getOperation(expression: BinaryExpression): VariableOperator {
    switch (expression.operator) {
      case '+':
        return (a: any, b: any) => a + b;
      case '-':
        return (a: any, b: any) => a - b;
      case '/':
        return (a: any, b: any) => a / b;
      case '%':
        return (a: any, b: any) => a % b;
      case '*':
        return (a: any, b: any) => a * b;
      case '**':
        return (a: any, b: any) => a ** b;
      default:
        throw new TypeError(
          'Forbidden binary expression at ' + locate(expression.loc),
        );
    }
  }

  static run(
    context: ExecutionContext,
    expression: BinaryExpression,
  ): VariableValue {
    const left: Expression =
      expression.left.type === 'PrivateName'
        ? expression.left.id
        : expression.left;
    const right: Expression = expression.right;
    return this.check(
      ExpressionExecutor.run(context, left),
      ExpressionExecutor.run(context, right),
      this.getOperation(expression),
    );
  }
}
