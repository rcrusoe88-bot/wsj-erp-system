import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStockInItemDto } from './create-stock-in-item.dto';

export class UpdateStockInDto {
  @IsOptional()
  @IsString()
  sourceReference?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStockInItemDto)
  items?: CreateStockInItemDto[];
}
