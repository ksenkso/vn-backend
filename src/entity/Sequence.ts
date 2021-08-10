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
