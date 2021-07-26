import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sequence } from './Sequence';

@Entity()
export class SoundNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column()
  sound: string;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence)
  sequence: Sequence;
}
