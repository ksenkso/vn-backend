import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Story } from './Story';
import { SequenceNode } from './SequenceNode';
import { Choice } from './Choice';
import { RouterNode } from './RouterNode';
import { File } from '@babel/types';

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

  @Column({ type: 'json', nullable: true })
  enterProgram: File | null;

  @Column({ type: 'json', nullable: true })
  leaveProgram: File | null;

  @Column({ nullable: true })
  choiceId: number | null;

  @OneToOne(() => Choice)
  @JoinColumn()
  choice: Choice;

  @OneToMany(() => SequenceNode, (node) => node.sequence)
  nodes: SequenceNode[];

  @OneToOne(() => RouterNode, (routerNode) => routerNode.sequence)
  router: RouterNode;
}
