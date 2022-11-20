import {
  Column,
  Entity,
  JoinColumn, ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user.entity';
import { Sequence } from './Sequence';
import { PlayerState } from './PlayerState';

export interface IStory {
  id: number;
  name: string;
  owner: User;
  rootId: number;
  root: Sequence;
  states: PlayerState[];
}

@Entity()
export class Story implements IStory {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;

  @Column({ nullable: true }) rootId: number;

  @OneToOne(() => Sequence)
  @JoinColumn()
  root: Sequence;

  @OneToMany(() => PlayerState, (state) => state.story) states: PlayerState[];
}
