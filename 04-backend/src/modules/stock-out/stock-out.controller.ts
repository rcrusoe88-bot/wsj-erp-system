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
import { StockOutService } from './stock-out.service';
import { CreateStockOutDto } from './dto/create-stock-out.dto';
import { UpdateStockOutDto } from './dto/update-stock-out.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('stock-out')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockOutController {
  constructor(private readonly stockOutService: StockOutService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.stockOutService.findAll({
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.stockOutService.findById(id);
  }

  @Post()
  @Roles('admin', 'operator')
  create(
    @Body() dto: CreateStockOutDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.stockOutService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles('admin', 'operator')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStockOutDto,
  ) {
    return this.stockOutService.update(id, dto);
  }

  @Post(':id/submit')
  @Roles('admin', 'operator')
  submit(@Param('id') id: string) {
    return this.stockOutService.submit(id);
  }
}
