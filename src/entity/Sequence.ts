import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn } from 'typeorm';
import { Story } from './Story';

@Entity()
export class Sequence {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  slug: string;

  @Column()
  storyId: number;

  @ManyToOne(() => Story)
  story: Story;
}
