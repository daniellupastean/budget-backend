import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
} from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { UsersService } from '../users/users.service';
import { CreateBankAccountDto } from './bank-accounts.dto';
import { BanksService } from '../banks/banks.service';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(
    private bankAccountsService: BankAccountsService,
    private usersService: UsersService,
    private banksService: BanksService,
  ) {}

  @Post('add')
  @Redirect()
  async createBankAccount(@Body() bankAccountDto: CreateBankAccountDto) {
    await this.bankAccountsService.createBankAccount(bankAccountDto);
    return {
      statusCode: 302,
      url: `user/${bankAccountDto.userId}/index`,
    };
  }

  @Get('user/:userId/index')
  @Render('bank-accounts/index.view.hbs')
  async getUsersView(@Param('userId') userId: string) {
    const user = await this.usersService.getById(userId);
    console.log(user);
    const bankAccounts = await this.bankAccountsService.getAllByUser(userId);
    console.log(bankAccounts);
    const bankAccountsForUI = bankAccounts.map((bankAccount) => {
      return {
        id: bankAccount.id,
        name: bankAccount.name,
        balance: `${bankAccount.balance} ${bankAccount.currency}`,
        bank: bankAccount.bank.name,
      };
    });
    return {
      user: { ...user, name: `${user.firstName} ${user.lastName}` },
      bankAccounts: bankAccountsForUI,
    };
  }

  @Get('user/:userId/add')
  @Render('bank-accounts/add.view.hbs')
  async addUserView(@Param('userId') userId: string) {
    const banks = await this.banksService.getAllBanks();
    return { user: { id: userId }, banks };
  }
}
