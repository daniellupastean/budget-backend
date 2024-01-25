import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { UsersModule } from './users/users.module';
import { BanksModule } from './banks/banks.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { LoggingModule } from 'src/utils/logger/logger.module';
import { LoggerMiddleware } from 'src/utils/logger/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LoggingModule,
    UsersModule,
    BanksModule,
    BankAccountsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
