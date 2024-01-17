import { Controller, Get } from '@nestjs/common';
import { BanksService } from './banks.service';

@Controller('banks')
export class BanksController {
  constructor(private banksService: BanksService) {}

  @Get()
  async getAllBanks() {
    return await this.banksService.getAllBanks();
  }
}
