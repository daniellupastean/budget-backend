import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'account_type' })
  accountType: string;

  @Column({ name: 'balance' })
  balance: number;

  @Column({ name: 'currency' })
  currency: string;

  @ManyToOne(() => User, (user) => user.bankAccounts, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
