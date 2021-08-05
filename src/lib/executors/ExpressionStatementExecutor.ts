import { ExecutionContext } from '../ExecutionContext';
import { ExpressionStatement } from '@babel/types';
import { BinaryExpressionExecutor } from './BinaryExpressionExecutor';
import { AssignmentOperatorExecutor } from './AssignmentOperatorExecutor';
import { LiteralExecutor } from './LiteralExecutor';
import { LogicExecutor } from './LogicExecutor';
import { UpdateExecutor } from './UpdateExecutor';
import { locate, Types } from '../utils';

export class ExpressionStatementExecutor {
  static run(context: ExecutionContext, statement: ExpressionStatement) {
    switch (statement.expression.type) {
      case Types.BinaryExpression: {
        return BinaryExpressionExecutor.run(context, statement.expression);
      }
      case Types.AssignmentExpression: {
        return AssignmentOperatorExecutor.run(context, statement.expression);
      }
      case Types.StringLiteral:
      case Types.NumericLiteral:
      case Types.BooleanLiteral: {
        return LiteralExecutor.run(context, statement.expression);
      }
      case Types.LogicalExpression: {
        return LogicExecutor.run(context, statement.expression);
      }
      case Types.UpdateExpression: {
        return UpdateExecutor.run(context, statement.expression);
      }
      default:
        throw new TypeError(
          `Unsupported expression at ${locate(statement.loc)}`,
        );
    }
  }
}
