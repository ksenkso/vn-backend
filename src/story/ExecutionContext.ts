import { Variable, VariableValue } from './types';
import { Identifier, Program, ReturnStatement, Statement } from '@babel/types';
import { locate } from './utils';
import { FunctionExecutor } from './executors/FunctionExecutor';
import { ConditionExecutor } from './executors/ConditionExecutor';
import { ExpressionStatementExecutor } from './executors/ExpressionStatementExecutor';

export class ExecutionContext {
  constructor(private variables: Map<string, Variable>) {}

  runProgram(program: Program) {
    return this.run(program.body[0]);
  }

  run(statement?: Statement | null): any {
    if (!statement) {
      return;
    }

    switch (statement.type) {
      case 'FunctionDeclaration': {
        return FunctionExecutor.run(this, statement);
      }
      case 'IfStatement': {
        return ConditionExecutor.run(this, statement);
      }
      case 'ExpressionStatement': {
        return ExpressionStatementExecutor.run(this, statement);
      }
      case 'ReturnStatement': {
        return (statement as ReturnStatement).argument;
      }
      case 'BlockStatement': {
        let result;
        statement.body.forEach((statement) => {
          result = this.run(statement);
        });
        return result;
      }
      default: {
        throw new TypeError(
          `Forbidden statement '${statement.type}' at ${locate(statement.loc)}`,
        );
      }
    }
  }

  getVariable(name: Identifier): Variable {
    if (!this.variables.has(name.name)) {
      throw new ReferenceError(
        `Variable is not defined: '${name.name}' at ${locate(name.loc)}`,
      );
    }
    return this.variables.get(name.name);
  }

  getVariableByName(name: string): Variable | undefined {
    return this.variables.get(name);
  }

  setVariable(name: Identifier, right: VariableValue) {
    const variable = this.getVariable(name);
    variable.value = right;

    return right;
  }
}
