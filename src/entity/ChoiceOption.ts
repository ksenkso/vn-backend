import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Choice } from './Choice';

@Entity()
export class ChoiceOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  choiceId: number;

  @OneToMany(() => Choice, (choice) => choice.options, {
    onDelete: 'CASCADE',
  })
  choice: Choice;
}
