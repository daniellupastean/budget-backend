import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { UsersModule } from './users/users.module';
import { BanksModule } from './banks/banks.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { LoggingModule } from 'src/utils/logger/logger.module';
import { LoggerMiddleware } from 'src/utils/logger/logger.middleware';
import { CacheManagerModule } from 'src/utils/cache-manager/cache-manager.module';
import { AuthModule } from './auth/auth.module';
import { LimitsModule } from './limits/limits.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LoggingModule,
    CacheManagerModule,
    AuthModule,
    UsersModule,
    BanksModule,
    BankAccountsModule,
    LimitsModule,
    TransactionsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
