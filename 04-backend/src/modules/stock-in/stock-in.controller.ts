import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StockInService } from './stock-in.service';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { UpdateStockInDto } from './dto/update-stock-in.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('stock-in')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockInController {
  constructor(private readonly stockInService: StockInService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.stockInService.findAll({
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.stockInService.findById(id);
  }

  @Post()
  @Roles('admin', 'operator')
  create(
    @Body() dto: CreateStockInDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.stockInService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles('admin', 'operator')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStockInDto,
  ) {
    return this.stockInService.update(id, dto);
  }

  @Post(':id/submit')
  @Roles('admin', 'operator')
  submit(@Param('id') id: string) {
    return this.stockInService.submit(id);
  }
}
