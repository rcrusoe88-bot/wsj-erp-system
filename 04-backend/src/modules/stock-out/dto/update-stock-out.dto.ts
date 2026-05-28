import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStockOutItemDto } from './create-stock-out-item.dto';

export class UpdateStockOutDto {
  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStockOutItemDto)
  items?: CreateStockOutItemDto[];
}
