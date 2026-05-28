import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StockOutType } from '@prisma/client';
import { CreateStockOutItemDto } from './create-stock-out-item.dto';

export class CreateStockOutDto {
  @IsEnum(StockOutType)
  stockOutType!: StockOutType;

  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @IsString()
  @IsNotEmpty()
  destination!: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateStockOutItemDto)
  items!: CreateStockOutItemDto[];
}
