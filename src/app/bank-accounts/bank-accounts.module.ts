import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './bank-account.entity';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { UsersModule } from '../users/users.module';
import { BanksModule } from '../banks/banks.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount]), UsersModule, BanksModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
})
export class BankAccountsModule {}
