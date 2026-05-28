import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @MinLength(1)
  materialCode!: string;

  @IsString()
  @IsNotEmpty()
  materialName!: string;

  @IsString()
  @IsNotEmpty()
  materialCategory!: string;

  @IsOptional()
  @IsString()
  specification?: string;

  @IsString()
  @IsNotEmpty()
  unit!: string;

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
  @IsString()
  remark?: string;
}
