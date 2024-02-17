import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { BankAccount } from '../bank-accounts/bank-account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async getAllByUser(userId: string) {
    return await this.transactionsRepository.find({
      where: {
        bankAccount: {
          user: {
            id: userId,
          },
        },
      },
    });
  }

  async withdraw(bankAccountId: string, amount: number, description: string) {
    const bankAccount = new BankAccount();
    bankAccount.id = bankAccountId;

    const transaction = new Transaction();
    transaction.amount = -amount;
    transaction.bankAccount = bankAccount;
    transaction.description = description;
    return await this.transactionsRepository.save(transaction);
  }

  async deposit(bankAccountId: string, amount: number, description: string) {
    const bankAccount = new BankAccount();
    bankAccount.id = bankAccountId;

    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.bankAccount = bankAccount;
    transaction.description = description;
    return await this.transactionsRepository.save(transaction);
  }
}
