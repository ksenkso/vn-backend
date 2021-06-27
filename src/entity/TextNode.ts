import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn } from 'typeorm';
import { Sequence } from './Sequence';

@Entity()
export class TextNode {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  order: number;

  @Column()
  speaker: string;

  @Column()
  text: string;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}
