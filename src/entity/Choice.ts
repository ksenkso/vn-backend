import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChoiceOption } from './ChoiceOption';
import { PlayerChoice } from './PlayerChoice';

@Entity()
export class Choice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  slug?: string;

  @OneToMany(() => ChoiceOption, (option) => option.choice)
  options: ChoiceOption[];

  @OneToMany(() => PlayerChoice, (playerChoice) => playerChoice.choice)
  playerChoices: PlayerChoice[];
}
