import { Expose, Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBankAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  balance: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsUUID()
  bankId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class UpdateBankAccountDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  balance?: number;
}

export class BankAccountDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly balance: string;

  @Expose()
  readonly currency: string;

  @Expose()
  @Transform(({ obj }) => obj.bank?.name)
  readonly bankName: string;
}
