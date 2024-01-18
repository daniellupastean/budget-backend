import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from '../bank-accounts/bank-account.entity';

@Entity('banks')
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.bank)
  bankAccounts: BankAccount[];
}
