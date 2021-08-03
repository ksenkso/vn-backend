import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Sequence } from './Sequence';
import { PlayerState } from './PlayerState';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => PlayerState, (state) => state.story)
  states: PlayerState[];
}
