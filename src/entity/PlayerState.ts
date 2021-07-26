import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { VariableValue } from '../story/types';

@Entity()
export class PlayerState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  state: Record<string, VariableValue>;
}
