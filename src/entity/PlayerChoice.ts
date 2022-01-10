import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Choice } from './Choice';
import { ChoiceOption } from './ChoiceOption';
import { User } from './user.entity';

export interface IPlayerChoice {
  id: number;
  choiceId: number;
  choice: Choice;
  optionId: number;
  option: ChoiceOption;
  userId: number;
  user: User;
}

@Entity()
export class PlayerChoice implements IPlayerChoice {
  @PrimaryGeneratedColumn() id: number;

  @Column() choiceId: number;

  @ManyToOne(() => Choice, (choice) => choice.playerChoices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  choice: Choice;

  @Column() optionId: number;

  @ManyToOne(() => ChoiceOption, (option) => option.playerChoices, {
    onDelete: 'CASCADE',
  })
  option: ChoiceOption;

  @Column() userId: number;

  @ManyToOne(() => User, (user) => user.playerChoices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
