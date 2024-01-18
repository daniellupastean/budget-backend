import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Redirect,
  Render,
} from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { UsersService } from '../users/users.service';
import {
  CreateBankAccountDto,
  UpdateBankAccountDto,
} from './bank-accounts.dto';
import { BanksService } from '../banks/banks.service';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(
    private bankAccountsService: BankAccountsService,
    private usersService: UsersService,
    private banksService: BanksService,
  ) {}

  // for MVC

  @Post('add')
  @Redirect()
  async createBankAccountWithRedirect(
    @Body() bankAccountDto: CreateBankAccountDto,
  ) {
    await this.bankAccountsService.createBankAccount(bankAccountDto);
    return {
      statusCode: 302,
      url: `user/${bankAccountDto.userId}/index`,
    };
  }

  @Get('user/:userId/index')
  @Render('bank-accounts/index.view.hbs')
  async getUsersView(@Param('userId', ParseUUIDPipe) userId: string) {
    const user = await this.usersService.getById(userId);
    const bankAccounts = await this.bankAccountsService.getAllByUser(userId);
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
  async createBankAccountView(@Param('userId', ParseUUIDPipe) userId: string) {
    const banks = await this.banksService.getAllBanks();
    return { user: { id: userId }, banks };
  }

  // for API

  @Get('user/:userId')
  async getAllByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.bankAccountsService.getAllMappedByUser(userId);
  }

  @Get(':id')
  async getBankAccountById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bankAccountsService.getMappedById(id);
  }

  @Post()
  async createBankAccount(@Body() bankAccountDto: CreateBankAccountDto) {
    return await this.bankAccountsService.createBankAccount(bankAccountDto);
  }

  @Put(':id')
  async updateBankAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() bankAccountDto: UpdateBankAccountDto,
  ) {
    return await this.bankAccountsService.updateBankAccount(id, bankAccountDto);
  }

  @Delete(':id')
  async deleteBankAccount(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
    return await this.bankAccountsService.deleteBankAccount(accountId, userId);
  }
}
