import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  SequenceNodeDescription,
  SequenceNodeType,
} from '../sequence/dto/sequence-node.dto';
import { Sequence } from './Sequence';

interface ISequenceNode {
  id: number;
  type: SequenceNodeType;
  description: SequenceNodeDescription;
  sequenceId: number;
  nextId: number | null;
  prevId: number | null;
}

@Entity()
export class SequenceNode implements ISequenceNode {
  @PrimaryGeneratedColumn() id: number;

  @Column() type: SequenceNodeType;

  @Column({ type: 'json' }) description: SequenceNodeDescription;

  @Column() sequenceId: number;

  @ManyToOne(() => Sequence, (sequence) => sequence.nodes, {
    onDelete: 'CASCADE',
  })
  sequence: Sequence;

  @Column({ nullable: true }) nextId: number | null;

  @OneToOne(() => SequenceNode)
  @JoinColumn()
  next?: SequenceNode;

  @Column({ nullable: true }) prevId: number | null;

  @OneToOne(() => SequenceNode)
  @JoinColumn()
  prev?: SequenceNode;
}
