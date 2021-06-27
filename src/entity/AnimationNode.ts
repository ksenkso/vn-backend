import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn } from 'typeorm';
import { Sequence } from './Sequence';

@Entity()
export class AnimationNode {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  order: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}
