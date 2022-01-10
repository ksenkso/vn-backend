import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RouterNode } from './RouterNode';
import { Sequence } from './Sequence';
import { File } from '@babel/types';

interface IRouteCondition {
  id: number;
  condition: File;
  routerId: number;
  router: RouterNode;
  sequenceId: number;
  sequence: Sequence;
}

/**
 * Описывает условие перехода на Sequence с sequenceId, выполняя программу condition
 */
@Entity()
export class RouteCondition implements IRouteCondition {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'json' }) condition: File;

  @Column() routerId: number;

  @ManyToOne(() => RouterNode, (router) => router.conditions)
  router: RouterNode;

  @Column() sequenceId: number;

  @ManyToOne(() => Sequence) sequence: Sequence;
}
