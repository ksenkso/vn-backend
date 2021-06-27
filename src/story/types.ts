export type VariableType = 'number' | 'boolean';
export type VariableValue = number | boolean;
export interface Variable {
  name: string;
  type: VariableType;
  value: VariableValue;
}

export type VariableOperator = (
  left: VariableValue,
  right: VariableValue,
) => VariableValue;

export type VariableComparator = (
  left: VariableValue,
  right: VariableValue,
) => boolean;
