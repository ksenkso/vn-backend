import { ExecutionContext } from '../ExecutionContext';
import { Expression } from '@babel/types';
import { VariableValue } from '../types';
import { BinaryExpressionExecutor } from './BinaryExpressionExecutor';
import { LogicExecutor } from './LogicExecutor';
import { LiteralExecutor } from './LiteralExecutor';
import { AssignmentOperatorExecutor } from './AssignmentOperatorExecutor';
import { locate, Types } from '../utils';

export class ExpressionExecutor {
  static run(context: ExecutionContext, expression: Expression): VariableValue {
    switch (expression.type) {
      case Types.Identifier:
        return context.getVariable(expression).value;
      case Types.BinaryExpression:
        return BinaryExpressionExecutor.run(context, expression);
      case Types.LogicalExpression:
        return LogicExecutor.run(context, expression);
      case Types.StringLiteral:
      case Types.NumericLiteral:
      case Types.BooleanLiteral:
        return LiteralExecutor.run(context, expression);
      case Types.AssignmentExpression:
        return AssignmentOperatorExecutor.run(context, expression);
      default:
        throw new TypeError(
          'Forbidden expression at ' + locate(expression.loc),
        );
    }
  }
}
