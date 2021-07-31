import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Sequence } from './Sequence';
import { ChoiceOption } from './ChoiceOption';

@Entity()
export class Choice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => ChoiceOption, (option) => option.choice)
  options: ChoiceOption[];

  @Column()
  sequenceId: number;

  @OneToMany(() => Sequence, (sequence) => sequence.choices, {
    onDelete: 'CASCADE',
  })
  sequence: Sequence;
}
