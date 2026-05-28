import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockInItemSourceDto {
  @IsString()
  @IsNotEmpty()
  upstreamMaterialId!: string;

  @IsString()
  @IsNotEmpty()
  upstreamLotNumber!: string;

  @IsNumber()
  @Min(0)
  consumedQuantity!: number;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class CreateStockInItemDto {
  @IsString()
  @IsNotEmpty()
  materialId!: string;

  @IsString()
  @IsNotEmpty()
  lotNumber!: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsOptional()
  @IsDateString()
  productionDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStockInItemSourceDto)
  sources?: CreateStockInItemSourceDto[];
}
