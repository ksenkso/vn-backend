import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RouterNode } from './RouterNode';
import { Sequence } from './Sequence';
import { File } from '@babel/types';

@Entity()
export class RouteCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  condition: File;

  @Column()
  routerId: number;

  @ManyToOne(() => RouterNode, (router) => router.conditions)
  router: RouterNode;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}
