import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Sequence } from './Sequence';
import { RouteCondition } from './RouteCondition';

export interface IRouterNode {
  id: number;
  sequences: Sequence[];
  conditions: RouteCondition[];
}

@Entity()
export class RouterNode implements IRouterNode {
  @PrimaryGeneratedColumn() id: number;

  @OneToMany(() => Sequence, (sequence) => sequence.router)
  sequences: Sequence[];

  @OneToMany(() => RouteCondition, (condition) => condition.router)
  conditions: RouteCondition[];
}
