import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateStockOutItemDto {
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
  @IsString()
  remark?: string;
}
