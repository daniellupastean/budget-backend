import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { BanksService } from './banks.service';

@Controller('banks')
export class BanksController {
  constructor(private banksService: BanksService) {}

  @Get()
  async getAllBanks() {
    return await this.banksService.getAllBanks();
  }

  @Delete(':id')
  async softDeleteBank(@Param('id', ParseUUIDPipe) id: string) {
    return await this.banksService.softDeleteBank(id);
  }
}
