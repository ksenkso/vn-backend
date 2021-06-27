import { ExecutionContext } from '../ExecutionContext';
import { AssignmentExpression } from '@babel/types';
import { VariableValue } from '../types';
import { locate } from '../utils';
import { ExpressionExecutor } from './ExpressionExecutor';

export class AssignmentOperatorExecutor {
  static run(
    context: ExecutionContext,
    operator: AssignmentExpression,
  ): VariableValue {
    switch (operator.operator) {
      case '=': {
        const left = operator.left;
        const right = ExpressionExecutor.run(context, operator.right);
        if (left.type === 'Identifier') {
          return context.setVariable(left, right);
        } else {
          throw new TypeError(
            'Can only assign to identifiers. Forbidden assignment at ' +
              locate(operator.loc),
          );
        }
      }
      case '+=': {
        const left = operator.left;
        const right = ExpressionExecutor.run(context, operator.right);
        if (left.type === 'Identifier') {
          const variable = context.getVariable(left);
          return ((variable.value as number) += right as any);
        } else {
          throw new TypeError(
            'Can only assign to identifiers. Forbidden assignment at ' +
              locate(operator.loc),
          );
        }
      }
      default:
        throw new TypeError(
          'Forbidden assignment expression at ' + locate(operator.loc),
        );
    }
  }
}
