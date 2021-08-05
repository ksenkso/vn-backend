import { SourceLocation } from '@babel/types';

export function locate(location: SourceLocation) {
  return `${location.start.line}:${location.start.column}`;
}

export enum Types {
  Identifier = 'Identifier',
  Program = 'Program',
  ReturnStatement = 'ReturnStatement',
  Statement = 'Statement',
  SourceLocation = 'SourceLocation',
  BinaryExpression = 'BinaryExpression',
  Expression = 'Expression',
  AssignmentExpression = 'AssignmentExpression',
  IfStatement = 'IfStatement',
  ExpressionStatement = 'ExpressionStatement',
  FunctionDeclaration = 'FunctionDeclaration',
  BooleanLiteral = 'BooleanLiteral',
  NumericLiteral = 'NumericLiteral',
  StringLiteral = 'StringLiteral',
  LogicalExpression = 'LogicalExpression',
  UpdateExpression = 'UpdateExpression',
  PrivateName = 'PrivateName',
  BlockStatement = 'BlockStatement',
}

export const ALLOWED_TYPES = new Set(Object.keys(Types));
