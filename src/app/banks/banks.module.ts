import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { BanksService } from './banks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  providers: [BanksService],
  exports: [BanksService],
})
export class BanksModule {}
