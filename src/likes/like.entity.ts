import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('likes')
@Index(['userId', 'movieId'], { unique: true })
export class Like {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: string;

  @Column()
  movieId: string;

  @Column({ default: new Date() })
  createdAt: Date;
}
