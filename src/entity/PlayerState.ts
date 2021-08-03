import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Variable } from '../lib/types';
import { User } from './user.entity';
import { Story } from './Story';

@Entity()
export class PlayerState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  state: Record<string, Variable>;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.states)
  @JoinColumn()
  user: User;

  @Column()
  storyId: number;

  @ManyToOne(() => Story, (story) => story.states)
  story: Story;

  toMap(): Map<string, Variable> {
    return new Map(
      Object.keys(this.state).map((key) => {
        return [key, this.state[key]];
      }),
    );
  }

  setState(variableMap: Map<string, Variable>) {
    const newState: Record<string, Variable> = {};
    for (const [name, value] of variableMap.entries()) {
      newState[name] = value;
    }
    this.state = newState;
  }
}
