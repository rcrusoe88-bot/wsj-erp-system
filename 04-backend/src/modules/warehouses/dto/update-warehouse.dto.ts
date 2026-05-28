import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RecordStatus } from '@prisma/client';

export class UpdateWarehouseDto {
  @IsOptional()
  @IsString()
  warehouseName?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;

  @IsOptional()
  @IsString()
  remark?: string;
}
