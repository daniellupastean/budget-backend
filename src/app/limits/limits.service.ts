import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Limit } from './limit.entity';

@Injectable()
export class LimitsService {
  constructor(
    @InjectRepository(Limit)
    private limitsRepository: Repository<Limit>,
  ) {}

  async getLimitByBankAccountId(id: string) {
    return await this.limitsRepository.findOneBy({ bankAccount: { id: id } });
  }
}
