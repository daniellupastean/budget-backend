import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Income } from '../incomes/income.entity';
import { Debt } from '../debts/debt.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Bank } from '../banks/bank.entity';
import { Limit } from '../limits/limit.entity';

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'balance', default: 0 })
  balance: number;

  @Column({ name: 'currency' })
  currency: string;

  @ManyToOne(() => User, (user) => user.bankAccounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Bank, (bank) => bank.bankAccounts)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @OneToMany(() => Income, (income) => income.bankAccount)
  incomes: Income[];

  @OneToMany(() => Debt, (debt) => debt.bankAccount)
  debts: Debt[];

  @OneToMany(() => Transaction, (transaction) => transaction.bankAccount)
  transactions: Transaction[];

  @OneToOne(() => Limit, (limit) => limit.bankAccount)
  limit: Limit[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
