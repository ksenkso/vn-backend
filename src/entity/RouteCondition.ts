import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expression } from '@babel/types';
import { RouterNode } from './RouterNode';
import { Sequence } from './Sequence';

@Entity()
export class RouteCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  condition: Expression;

  @Column()
  routerId: number;

  @ManyToOne(() => RouterNode)
  router: RouterNode;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}
