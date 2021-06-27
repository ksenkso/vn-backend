import { User } from './user.entity';
import { Column, Entity, ManyToMany, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Role {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @ManyToMany(() => User)
  users: User[];
}
