import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sequence } from './Sequence';

@Entity()
export class TextNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column()
  speaker: string;

  @Column()
  text: string;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}
