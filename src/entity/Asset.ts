import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn } from 'typeorm';
import { Sequence } from './Sequence';

@Entity()
export class Asset {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}
