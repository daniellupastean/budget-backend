import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BankAccount } from '../bank-accounts/bank-account.entity';

@Entity('debts')
export class Debt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => BankAccount, (bankAccount) => bankAccount.debts)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @Column({ name: 'total_amount' })
  totalAmount: number;

  @Column({ name: 'remaining_amount' })
  remainingAmount: number;

  @Column({ name: 'interest_rate' })
  interestRate: number;

  @Column({ name: 'monthly_payment' })
  monthlyPayment: number;

  @Column()
  description: string;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
