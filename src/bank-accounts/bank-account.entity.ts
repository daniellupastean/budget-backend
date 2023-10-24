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
import { Income } from '../incomes/income.entity';
import { Debt } from '../debts/debt.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_name' })
  accountName: string;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'account_type' })
  accountType: string;

  @Column({ name: 'balance' })
  balance: number;

  @Column({ name: 'currency' })
  currency: string;

  @ManyToOne(() => User, (user) => user.bankAccounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Income, (income) => income.bankAccount)
  incomes: Income[];

  @OneToMany(() => Debt, (debt) => debt.bankAccount)
  debts: Debt[];

  @OneToMany(() => Transaction, (transaction) => transaction.bankAccount)
  transactions: Transaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
