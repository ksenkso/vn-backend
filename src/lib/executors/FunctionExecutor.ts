import { ExecutionContext } from '../ExecutionContext';
import { FunctionDeclaration } from '@babel/types';
import { locate } from '../utils';

export class FunctionExecutor {
  static permittedFunctions = new Set(['OnNodeEnter', 'OnNodeLeave', 'Route']);

  static run(context: ExecutionContext, func: FunctionDeclaration) {
    if (!func.id?.name) {
      throw new TypeError(
        'Invalid function declaration at ' + locate(func.loc),
      );
    }
    if (FunctionExecutor.permittedFunctions.has(func.id?.name)) {
      return func.body.body.reduce((returnValue, statement) => {
        return context.run(statement);
      }, null);
    }
  }
}
