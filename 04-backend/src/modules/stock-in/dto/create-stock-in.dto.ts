import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StockInType } from '@prisma/client';
import { CreateStockInItemDto } from './create-stock-in-item.dto';

export class CreateStockInDto {
  @IsEnum(StockInType)
  stockInType!: StockInType;

  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @IsOptional()
  @IsString()
  sourceReference?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateStockInItemDto)
  items!: CreateStockInItemDto[];
}
