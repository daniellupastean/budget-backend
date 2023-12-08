import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from './bank-account.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountsRepository: Repository<BankAccount>,
  ) {}

  async getAllByUserId(userId: string) {
    const user = new User();
    user.id = userId;
    return await this.bankAccountsRepository.find({ where: { user } });
  }
}
