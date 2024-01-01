import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from './bank-account.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateBankAccountDto } from './bank-accounts.dto';
import { Bank } from '../banks/bank.entity';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountsRepository: Repository<BankAccount>,
  ) {}

  async getAllByUser(userId: string) {
    console.log(userId);
    return await this.bankAccountsRepository.find({
      where: { user: { id: userId } },
      relations: { bank: true },
    });
  }

  async createBankAccount(bankAccountDto: CreateBankAccountDto) {
    const bankAccount = new BankAccount();

    const bank = new Bank();
    bank.id = bankAccountDto.bankId;

    const user = new User();
    user.id = bankAccountDto.userId;

    bankAccount.name = bankAccountDto.name;
    bankAccount.balance = bankAccountDto.balance;
    bankAccount.currency = bankAccountDto.currency;
    bankAccount.bank = bank;
    bankAccount.user = user;

    return await this.bankAccountsRepository.save(bankAccount);
  }
}
