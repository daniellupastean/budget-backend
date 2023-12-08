import { Controller, Get, Query } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private bankAccountsService: BankAccountsService) {}

  @Get()
  async getAllByUserId(@Query('userId') userId: string) {
    return await this.bankAccountsService.getAllByUserId(userId);
  }
}
