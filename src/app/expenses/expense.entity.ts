import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'currency' })
  currency: string; // change to enum

  @Column({ name: 'category' })
  category: string; // change to enum

  @Column({ name: 'due_date', nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  frequecy: string; // change to enum

  @Column({ nullable: true })
  period: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
