import { SourceLocation } from '@babel/types';

export function locate(location: SourceLocation) {
  return `${location.start.line}:${location.start.column}`;
}
