import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn } from 'typeorm';
import { Sequence } from './Sequence';

@Entity()
export class RouteNode {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  order: number;

  @Column()
  program: string;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}
