import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sequence } from './Sequence';

@Entity()
export class RouterNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column()
  program: string;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}