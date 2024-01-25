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
    this.logger.info(`Retrieving all bank accounts for user: ${userId}`);
    const cacheKey = `bankAccounts-${userId}`;

    try {
      let data: BankAccount[] = await this.cacheManager.get(cacheKey);

      if (!data) {
        this.logger.info(`Cache miss for user: ${userId}`);
        data = await this.bankAccountsRepository.find({
          where: { user: { id: userId } },
          relations: { bank: true },
        });
        await this.cacheManager.set(cacheKey, data, 1000000);
        this.logger.info(
          `Fetched and cached bank accounts for user: ${userId}`,
        );
      } else {
        this.logger.info(`Retrieved cached data for user: ${userId}`);
      }

      return data;
    } catch (error) {
      this.logger.error(
        `Error retrieving bank accounts for user ${userId} - ${error.message}`,
      );
      throw error;
    }
  }

  async getAllMappedByUser(userId: string) {
    this.logger.info(`Retrieving all mapped bank accounts for user: ${userId}`);
    const cacheKey = `bankAccountsMapped-${userId}`;

    try {
      let data: BankAccountDto[] = await this.cacheManager.get(cacheKey);

      if (!data) {
        this.logger.info(`Cache miss for user: ${userId}`);
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
        this.logger.info(
          `Fetched and cached bank accounts for user: ${userId}`,
        );
      } else {
        this.logger.info(`Retrieved cached data for user: ${userId}`);
      }

      return data;
    } catch (error) {
      this.logger.error(
        `Error retrieving mapped bank accounts for user ${userId} - ${error.message}`,
      );
      throw error;
    }
  }

  async getMappedById(id: string) {
    this.logger.info(`Retrieving bank account with ID: ${id}`);

    try {
      const bankAccount = await this.bankAccountsRepository.findOne({
        where: { id: id },
        relations: { bank: true },
      });

      if (!bankAccount) {
        this.logger.warn(`No bank account found with ID: ${id}`);
        return null;
      }

      const bankAccountDto = plainToClass(BankAccountDto, bankAccount, {
        excludeExtraneousValues: true,
      });

      this.logger.info(
        `Bank account with ID: ${id} retrieved and mapped to DTO`,
      );
      return bankAccountDto;
    } catch (error) {
      this.logger.error(
        `Error retrieving bank account with ID: ${id} - ${error.message}`,
      );
      throw error;
    }
  }

  async createBankAccount(bankAccountDto: CreateBankAccountDto) {
    this.logger.info(
      `Creating bank account for user: ${bankAccountDto.userId}`,
    );

    try {
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

      const savedAccount = await this.bankAccountsRepository.save(bankAccount);
      await this.invalidateCache(bankAccountDto.userId);

      this.logger.info(
        `Bank account created with ID: ${savedAccount.id} for user: ${bankAccountDto.userId}`,
      );
      return savedAccount;
    } catch (error) {
      this.logger.error(
        `Error creating bank account for user ${bankAccountDto.userId} - ${error.message}`,
      );
      throw error;
    }
  }

  async updateBankAccount(id: string, bankAccountDto: UpdateBankAccountDto) {
    this.logger.info(`Updating bank account with ID: ${id}`);

    try {
      const userId = bankAccountDto.userId;
      await this.invalidateCache(userId);

      // Remove userId from DTO to prevent updating the userId field in the bank account
      delete bankAccountDto.userId;

      const updateResult = await this.bankAccountsRepository.update(
        id,
        bankAccountDto,
      );
      if (updateResult.affected > 0) {
        this.logger.info(`Bank account ${id} successfully updated`);
      } else {
        this.logger.warn(`No bank account found with ID: ${id} for update`);
      }
      return updateResult;
    } catch (error) {
      this.logger.error(
        `Error updating bank account with ID: ${id} - ${error.message}`,
      );
      throw error;
    }
  }

  async deleteBankAccount(id: string, userId: string) {
    this.logger.info(`Deleting bank account with ID: ${id} for user ${userId}`);

    try {
      await this.invalidateCache(userId);
      const deleteResult = await this.bankAccountsRepository.delete(id);
      if (deleteResult.affected > 0) {
        this.logger.info(`Bank account ${id} successfully deleted`);
      } else {
        this.logger.warn(`No bank account found with ID: ${id} for deletion`);
      }
      return deleteResult;
    } catch (error) {
      this.logger.error(
        `Error deleting bank account with ID: ${id} - ${error.message}`,
      );
      throw error;
    }
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
