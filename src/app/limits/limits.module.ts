import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Limit } from './limit.entity';
import { LimitsService } from './limits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Limit])],
  controllers: [],
  providers: [LimitsService],
  exports: [LimitsService],
})
export class LimitsModule {}
