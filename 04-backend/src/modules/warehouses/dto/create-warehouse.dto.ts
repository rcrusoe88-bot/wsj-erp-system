import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @MinLength(1)
  warehouseCode!: string;

  @IsString()
  @IsNotEmpty()
  warehouseName!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}
