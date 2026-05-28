import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { RecordStatus } from '@prisma/client';

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  materialName?: string;

  @IsOptional()
  @IsString()
  materialCategory?: string;

  @IsOptional()
  @IsString()
  specification?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  batchManaged?: boolean;

  @IsOptional()
  @IsBoolean()
  expiryManaged?: boolean;

  @IsOptional()
  @IsString()
  storageCondition?: string;

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;

  @IsOptional()
  @IsString()
  remark?: string;
}
