import { Controller, Get, Query, Render } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private bankAccountsService: BankAccountsService) {}

  @Get()
  async getAllByUserId(@Query('userId') userId: string) {
    return await this.bankAccountsService.getAllByUserId(userId);
  }

  @Get('view')
  @Render('bank-accounts/index')
  async getUsersView() {
    // const users = await this.usersService.getAllUsers();
    // const usersForUI = users.map((user) => {
    //   return {
    //     id: user.id,
    //     name: user.firstName + ' ' + user.lastName,
    //     email: user.email,
    //   };
    // });
    // return { users: usersForUI };
  }
}
