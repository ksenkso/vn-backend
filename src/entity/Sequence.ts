import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Story } from './Story';
import { SequenceNode } from './SequenceNode';

@Entity()
export class Sequence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column({ nullable: true })
  storyId: number;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  story: Story;

  @OneToMany(() => SequenceNode, (node) => node.sequence)
  nodes: SequenceNode[];
}
