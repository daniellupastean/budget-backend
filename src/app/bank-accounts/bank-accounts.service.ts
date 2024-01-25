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
import { Cache } from '@nestjs/cache-manager';
import { Logger } from 'winston';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountsRepository: Repository<BankAccount>,
    private cacheManager: Cache,
    @Inject('WINSTON_LOGGER')
    private logger: Logger,
  ) {}

  async getAllByUser(userId: string) {
    const cacheKey = `bankAccounts-${userId}`;
    let data: BankAccount[] = await this.cacheManager.get(cacheKey);

    if (!data) {
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

    if (!data) {
      this.logger.info('Cached data not found');
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
    } else {
      this.logger.info('Retrieved cached data');
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
