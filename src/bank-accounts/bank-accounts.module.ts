import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './bank-account.entity';
import { BankAccountsService } from './bank-accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount])],
  providers: [BankAccountsService],
})
export class BankAccountsModule {}
