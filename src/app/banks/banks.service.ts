import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { Repository } from 'typeorm';
import { Logger } from 'winston';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank)
    private banksRepository: Repository<Bank>,
    @Inject('WINSTON_LOGGER')
    private logger: Logger,
  ) {}

  async getAllBanks() {
    this.logger.info('Fetching all banks');
    try {
      const banks = await this.banksRepository.find({
        select: { id: true, name: true },
        where: { isDeleted: false },
      });
      this.logger.info(`Found ${banks.length} banks`);
      return banks;
    } catch (error) {
      this.logger.error(`Error fetching all banks: ${error.message}`);
      throw error;
    }
  }

  async softDeleteBank(id: string) {
    this.logger.info(`Soft deleting bank with ID: ${id}`);
    try {
      const updateResult = await this.banksRepository.update(id, {
        isDeleted: true,
      });
      if (updateResult.affected > 0) {
        this.logger.info(`Bank soft deleted with ID: ${id}`);
      } else {
        this.logger.warn(`No bank found with ID: ${id} to soft delete`);
      }
      return updateResult;
    } catch (error) {
      this.logger.error(
        `Error soft deleting bank with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }
}
