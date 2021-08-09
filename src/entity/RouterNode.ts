import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sequence } from './Sequence';
import { RouteCondition } from './RouteCondition';
import { OneToMany } from 'typeorm';

@Entity()
export class RouterNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;

  @OneToMany(() => RouteCondition, (condition) => condition.router)
  conditions: RouteCondition[];
}
