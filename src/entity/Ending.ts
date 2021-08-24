import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';

@Entity()
export class Ending {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  storyId: number;
}
