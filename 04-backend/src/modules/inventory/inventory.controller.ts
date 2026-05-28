import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('balances')
  findBalances(
    @Query('materialId') materialId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('lotNumber') lotNumber?: string,
    @Query('expiryStatus') expiryStatus?: string,
    @Query('stockStatus') stockStatus?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.inventoryService.findBalances({
      materialId,
      warehouseId,
      lotNumber,
      expiryStatus,
      stockStatus,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Get('balances/:id')
  findBalanceById(@Param('id') id: string) {
    return this.inventoryService.findBalanceById(id);
  }

  @Get('transactions')
  findTransactions(
    @Query('materialId') materialId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('lotNumber') lotNumber?: string,
    @Query('transactionType') transactionType?: string,
    @Query('sourceType') sourceType?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.inventoryService.findTransactions({
      materialId,
      warehouseId,
      lotNumber,
      transactionType,
      sourceType,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }
}
