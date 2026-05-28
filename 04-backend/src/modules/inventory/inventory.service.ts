import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findBalances(params: {
    materialId?: string;
    warehouseId?: string;
    lotNumber?: string;
    expiryStatus?: string;
    stockStatus?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { materialId, warehouseId, lotNumber, expiryStatus, stockStatus, page = 1, pageSize = 20 } = params;
    const where: any = {};

    if (materialId) where.materialId = materialId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (lotNumber) where.lotNumber = { contains: lotNumber };
    if (expiryStatus) where.expiryStatus = expiryStatus;
    if (stockStatus) where.stockStatus = stockStatus;

    const [items, total] = await Promise.all([
      this.prisma.inventoryBalance.findMany({
        where,
        include: {
          material: { select: { id: true, materialCode: true, materialName: true, unit: true } },
          warehouse: { select: { id: true, warehouseCode: true, warehouseName: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.inventoryBalance.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findBalanceById(id: string) {
    const balance = await this.prisma.inventoryBalance.findUnique({
      where: { id },
      include: {
        material: { select: { id: true, materialCode: true, materialName: true, unit: true } },
        warehouse: { select: { id: true, warehouseCode: true, warehouseName: true } },
      },
    });
    if (!balance) {
      throw new NotFoundException('库存记录不存在');
    }
    return balance;
  }

  async findTransactions(params: {
    materialId?: string;
    warehouseId?: string;
    lotNumber?: string;
    transactionType?: string;
    sourceType?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { materialId, warehouseId, lotNumber, transactionType, sourceType, page = 1, pageSize = 20 } = params;
    const where: any = {};

    if (materialId) where.materialId = materialId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (lotNumber) where.lotNumber = { contains: lotNumber };
    if (transactionType) where.transactionType = transactionType;
    if (sourceType) where.sourceType = sourceType;

    const [items, total] = await Promise.all([
      this.prisma.inventoryTransaction.findMany({
        where,
        include: {
          material: { select: { id: true, materialCode: true, materialName: true } },
          warehouse: { select: { id: true, warehouseCode: true, warehouseName: true } },
          operatedBy: { select: { id: true, username: true, fullName: true } },
        },
        orderBy: { operatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.inventoryTransaction.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }
}
