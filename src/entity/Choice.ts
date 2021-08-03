import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChoiceOption } from './ChoiceOption';

@Entity()
export class Choice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => ChoiceOption, (option) => option.choice)
  options: ChoiceOption[];
}
