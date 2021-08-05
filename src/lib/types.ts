export type VariableType = 'number' | 'boolean' | 'string';
export type VariableValue = string | number | boolean | null;
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
