import {
  Column,
  Entity,
  JoinColumn,
  ObjectID,
  ObjectIdColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Sequence } from './Sequence';

@Entity()
export class Story {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @Column({ nullable: true })
  rootId: number;

  @OneToOne(() => Sequence)
  @JoinColumn()
  root: Sequence;
}
