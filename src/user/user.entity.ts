import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
