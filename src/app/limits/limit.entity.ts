import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BankAccount } from '../bank-accounts/bank-account.entity';

@Entity('limits')
export class Limit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  value: number;

  @OneToOne(() => BankAccount, (bankAccount) => bankAccount.limit)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;
}
