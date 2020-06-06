import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;
  @ManyToOne(() => User, (user) => user.lessonsToTake)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column()
  teacherId: number;
  @ManyToOne(() => User, (user) => user.lessonsToTeach)
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @Column()
  date: string;

  @Column()
  time: string;
}
