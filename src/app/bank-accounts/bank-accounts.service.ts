import { Inject, Injectable } from '@nestjs/common';
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
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountsRepository: Repository<BankAccount>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async getAllByUser(userId: string) {
    const cacheKey = `bankAccounts-${userId}`;
    let data: BankAccount[] = await this.cacheManager.get(cacheKey);

    console.log('get all');

    if (!data) {
      console.log('did not find cache');
      data = await this.bankAccountsRepository.find({
        where: { user: { id: userId } },
        relations: { bank: true },
      });
      await this.cacheManager.set(cacheKey, data, 1000000);
    }

    return data;
  }

  async getAllMappedByUser(userId: string) {
    const cacheKey = `bankAccountsMapped-${userId}`;
    let data: BankAccountDto[] = await this.cacheManager.get(cacheKey);
    console.log('get all mapped');

    if (!data) {
      console.log('did not find cache');
      const bankAccounts = await this.bankAccountsRepository.find({
        where: { user: { id: userId } },
        relations: { bank: true },
      });

      data = bankAccounts.map((bankAccount) =>
        plainToClass(BankAccountDto, bankAccount, {
          excludeExtraneousValues: true,
        }),
      );

      await this.cacheManager.set(cacheKey, data, 1000000); // ~ 16min
    }

    return data;
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

    await this.invalidateCache(bankAccountDto.userId);
    return await this.bankAccountsRepository.save(bankAccount);
  }

  async updateBankAccount(id: string, bankAccountDto: UpdateBankAccountDto) {
    await this.invalidateCache(bankAccountDto.userId);
    delete bankAccountDto.userId;
    return await this.bankAccountsRepository.update(id, bankAccountDto);
  }

  async deleteBankAccount(id: string, userId: string) {
    await this.invalidateCache(userId);
    return await this.bankAccountsRepository.delete(id);
  }

  private async invalidateCache(userId: string) {
    const cacheKeys = [
      `bankAccounts-${userId}`,
      `bankAccountsMapped-${userId}`,
    ];
    for (let key of cacheKeys) {
      await this.cacheManager.del(key);
    }
  }
}
