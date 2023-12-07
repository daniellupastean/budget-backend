import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { BankAccount } from '../bank-accounts/bank-account.entity';

@Entity('banks')
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.user)
  bankAccounts: BankAccount[];

  @Column({ name: 'month' })
  month: number;

  @Column({ name: 'year' })
  year: number;

  @Column({ name: 'total_amount' })
  totalAmount: number;

  @Column({ name: 'spent_amount' })
  spentAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
