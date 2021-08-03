import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Choice } from './Choice';

@Entity()
export class ChoiceOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  choiceId: number;

  @ManyToOne(() => Choice, (choice) => choice.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  choice: Choice;
}
