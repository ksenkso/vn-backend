import { User } from './user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export interface IRole {
  id: number;
  name: string;
  users: User[];
}

@Entity()
export class Role implements IRole {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;

  @ManyToMany(() => User) users: User[];
}
