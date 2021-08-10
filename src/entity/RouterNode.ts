import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { OneToOne } from 'typeorm';
import { JoinColumn } from 'typeorm';
import { Sequence } from './Sequence';
import { RouteCondition } from './RouteCondition';

@Entity()
export class RouterNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sequenceId: number;

  @OneToOne(() => Sequence, (sequence) => sequence.router)
  @JoinColumn()
  sequence: Sequence;

  @OneToMany(() => RouteCondition, (condition) => condition.router)
  conditions: RouteCondition[];
}
