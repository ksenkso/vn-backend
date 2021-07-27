import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  SequenceNodeDescription,
  SequenceNodeType,
} from '../sequence/dto/sequence-node.dto';
import { Sequence } from './Sequence';

@Entity()
export class SequenceNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: SequenceNodeType;

  @Column({ type: 'json' })
  description: SequenceNodeDescription;

  @Column()
  order: number;

  @Column()
  sequenceId: number;

  @ManyToOne(() => Sequence, (sequence) => sequence.nodes, {
    onDelete: 'CASCADE',
  })
  sequence: Sequence;
}
