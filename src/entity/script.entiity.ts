import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Script {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;
}
