import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sequence } from './Sequence';

export enum ActionNodeType {
  ENTER = 'ENTER',
  LEAVE = 'LEAVE',
}

@Entity()
export class ActionNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: ActionNodeType;

  @Column()
  program: string;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;

  withoutProgram() {
    return {
      id: this.id,
      type: this.type,
      sequenceId: this.sequenceId,
    };
  }
}
