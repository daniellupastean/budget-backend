import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { DepositDto, WithdrawDto } from './transactions.dtos';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  async getAllUserTransactions(@AuthUser() user: User) {
    return await this.transactionsService.getAllByUser(user.id);
  }

  @Post('withdraw')
  async withdraw(@Body() withdrawData: WithdrawDto) {
    return await this.transactionsService.withdraw(
      withdrawData.bankAccountId,
      withdrawData.amount,
      withdrawData.description,
    );
  }

  @Post('deposit')
  async deposit(@Body() depositData: DepositDto) {
    return await this.transactionsService.deposit(
      depositData.bankAccountId,
      depositData.amount,
      depositData.description,
    );
  }
}
