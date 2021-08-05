import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Choice } from './Choice';
import { PlayerChoice } from './PlayerChoice';

@Entity()
export class ChoiceOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  slug: string;

  @Column()
  choiceId: number;

  @ManyToOne(() => Choice, (choice) => choice.options, {
    onDelete: 'CASCADE',
  })
  choice: Choice;

  @OneToMany(() => PlayerChoice, (playerChoice) => playerChoice.option)
  playerChoices: PlayerChoice[];
}
