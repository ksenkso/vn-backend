import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RouterNode } from './RouterNode';
import { Sequence } from './Sequence';
import { File } from '@babel/types';

export interface IRouteCondition {
  id: number;
  condition: File;
  text: string;
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

  @Column() text: string;

  @Column() routerId: number;

  @ManyToOne(() => RouterNode, (router) => router.conditions, {
    onDelete: 'CASCADE',
  })
  router: RouterNode;

  @Column() sequenceId: number;

  @ManyToOne(() => Sequence, {
    onDelete: 'CASCADE',
  }) sequence: Sequence;
}
