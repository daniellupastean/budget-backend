import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from './bank-account.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import {
  BankAccountDto,
  CreateBankAccountDto,
  UpdateBankAccountDto,
} from './bank-accounts.dto';
import { Bank } from '../banks/bank.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountsRepository: Repository<BankAccount>,
  ) {}

  async getAllByUser(userId: string) {
    return await this.bankAccountsRepository.find({
      where: { user: { id: userId } },
      relations: { bank: true },
    });
  }

  async getAllMappedByUser(userId: string) {
    const bankAccounts = await this.bankAccountsRepository.find({
      where: { user: { id: userId } },
      relations: { bank: true },
    });

    return bankAccounts.map((bankAccount) =>
      plainToClass(BankAccountDto, bankAccount, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getMappedById(id: string) {
    const bankAccount = await this.bankAccountsRepository.findOne({
      where: { id: id },
      relations: { bank: true },
    });
    return plainToClass(BankAccountDto, bankAccount, {
      excludeExtraneousValues: true,
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

  async updateBankAccount(id: string, bankAccountDto: UpdateBankAccountDto) {
    return await this.bankAccountsRepository.update(id, bankAccountDto);
  }
}
