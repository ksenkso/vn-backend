import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sequence } from './Sequence';
import { RouteCondition } from './RouteCondition';

interface IRouterNode {
  id: number;
  sequenceId: number;
  sequence: Sequence;
  conditions: RouteCondition[];
}

@Entity()
export class RouterNode implements IRouterNode {
  @PrimaryGeneratedColumn() id: number;

  @Column() sequenceId: number;

  @OneToOne(() => Sequence, (sequence) => sequence.router)
  @JoinColumn()
  sequence: Sequence;

  @OneToMany(() => RouteCondition, (condition) => condition.router)
  conditions: RouteCondition[];
}
