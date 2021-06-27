import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn } from 'typeorm';
import { Sequence } from './Sequence';

@Entity()
export class SoundNode {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  order: number;

  @Column()
  sound: string;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}
