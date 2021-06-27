import { ExecutionContext } from '../ExecutionContext';
import { IfStatement } from '@babel/types';
import { ExpressionExecutor } from './ExpressionExecutor';

export class ConditionExecutor {
  static run(context: ExecutionContext, condition: IfStatement) {
    const isValid = ExpressionExecutor.run(context, condition.test);

    return context.run(isValid ? condition.consequent : condition.alternate);
  }
}
