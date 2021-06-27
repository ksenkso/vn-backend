import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { VariableValue } from '../story/types';

@Entity()
export class PlayerState {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: 'json' })
  state: Record<string, VariableValue>;
}
