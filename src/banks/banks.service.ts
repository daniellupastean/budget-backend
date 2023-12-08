import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank)
    private banksRepository: Repository<Bank>,
  ) {}

  async getAllBanks() {
    return await this.banksRepository.find();
  }
}
