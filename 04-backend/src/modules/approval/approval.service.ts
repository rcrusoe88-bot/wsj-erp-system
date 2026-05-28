import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApproveDto } from './dto/approve.dto';
import { ApprovalDecision, BusinessType, Prisma } from '@prisma/client';

@Injectable()
export class ApprovalService {
  constructor(private readonly prisma: PrismaService) {}

  async approveStockIn(
    orderId: string,
    dto: ApproveDto,
    reviewerId: string,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const order = await tx.stockInOrder.findUnique({
          where: { id: orderId },
          include: {
            items: { include: { sources: true } },
          },
        });

        if (!order) {
          throw new NotFoundException('入库单不存在');
        }
        if (order.status !== 'pending_review') {
          throw new BadRequestException('只能审批待审核状态的入库单');
        }

        const now = new Date();
        const isApproved = dto.decision === ApprovalDecision.approved;

        await tx.approvalRecord.create({
          data: {
            businessType: BusinessType.stock_in_order,
            businessId: orderId,
            reviewerId,
            decision: dto.decision,
            decisionReason: dto.decisionReason,
            reviewedAt: now,
          },
        });

        if (isApproved) {
          for (const item of order.items) {
            const balance = await tx.inventoryBalance.upsert({
              where: {
                materialId_warehouseId_lotNumber: {
                  materialId: item.materialId,
                  warehouseId: order.warehouseId,
                  lotNumber: item.lotNumber,
                },
              },
              create: {
                materialId: item.materialId,
                warehouseId: order.warehouseId,
                lotNumber: item.lotNumber,
                quantityOnHand: new Prisma.Decimal(item.quantity),
                quantityAvailable: new Prisma.Decimal(item.quantity),
                quantityLocked: new Prisma.Decimal(0),
                productionDate: item.productionDate,
                expiryDate: item.expiryDate,
              },
              update: {
                quantityOnHand: { increment: new Prisma.Decimal(item.quantity) },
                quantityAvailable: { increment: new Prisma.Decimal(item.quantity) },
                productionDate: item.productionDate ?? undefined,
                expiryDate: item.expiryDate ?? undefined,
                lastTransactionAt: now,
              },
            });

            await tx.inventoryTransaction.create({
              data: {
                materialId: item.materialId,
                warehouseId: order.warehouseId,
                lotNumber: item.lotNumber,
                transactionType: 'stock_in',
                direction: 'increase',
                quantity: new Prisma.Decimal(item.quantity),
                quantityBefore: new Prisma.Decimal(balance.quantityOnHand).minus(
                  new Prisma.Decimal(item.quantity),
                ),
                quantityAfter: new Prisma.Decimal(balance.quantityOnHand),
                sourceType: BusinessType.stock_in_order,
                sourceId: orderId,
                operatedById: reviewerId,
                operatedAt: now,
              },
            });
          }

          await tx.stockInOrder.update({
            where: { id: orderId },
            data: { status: 'approved', approvedAt: now },
          });
        } else {
          await tx.stockInOrder.update({
            where: { id: orderId },
            data: { status: 'rejected', rejectedAt: now },
          });
        }

        return { success: true, decision: dto.decision };
      },
      { isolationLevel: 'Serializable' },
    );
  }

  async approveStockOut(
    orderId: string,
    dto: ApproveDto,
    reviewerId: string,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const order = await tx.stockOutOrder.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (!order) {
          throw new NotFoundException('出库单不存在');
        }
        if (order.status !== 'pending_review') {
          throw new BadRequestException('只能审批待审核状态的出库单');
        }

        const now = new Date();
        const isApproved = dto.decision === ApprovalDecision.approved;

        await tx.approvalRecord.create({
          data: {
            businessType: BusinessType.stock_out_order,
            businessId: orderId,
            reviewerId,
            decision: dto.decision,
            decisionReason: dto.decisionReason,
            reviewedAt: now,
          },
        });

        if (isApproved) {
          for (const item of order.items) {
            const balanceKey = {
              materialId: item.materialId,
              warehouseId: order.warehouseId,
              lotNumber: item.lotNumber,
            };

            const balance = await tx.inventoryBalance.findUnique({
              where: { materialId_warehouseId_lotNumber: balanceKey },
            });

            if (!balance) {
              throw new BadRequestException(
                `批次 ${item.lotNumber} 库存不存在`,
              );
            }

            if (balance.quantityAvailable.lessThan(item.quantity)) {
              throw new BadRequestException(
                `批次 ${item.lotNumber} 可用库存不足`,
              );
            }

            if (
              balance.expiryDate &&
              balance.expiryDate < now
            ) {
              throw new BadRequestException(
                `批次 ${item.lotNumber} 已过期，不可出库`,
              );
            }

            const newOnHand = balance.quantityOnHand.minus(item.quantity);
            const newAvailable = balance.quantityAvailable.minus(item.quantity);

            await tx.inventoryBalance.update({
              where: { id: balance.id },
              data: {
                quantityOnHand: newOnHand,
                quantityAvailable: newAvailable,
                lastTransactionAt: now,
              },
            });

            await tx.inventoryTransaction.create({
              data: {
                materialId: item.materialId,
                warehouseId: order.warehouseId,
                lotNumber: item.lotNumber,
                transactionType: 'stock_out',
                direction: 'decrease',
                quantity: new Prisma.Decimal(item.quantity),
                quantityBefore: balance.quantityOnHand,
                quantityAfter: newOnHand,
                sourceType: BusinessType.stock_out_order,
                sourceId: orderId,
                operatedById: reviewerId,
                operatedAt: now,
              },
            });
          }

          await tx.stockOutOrder.update({
            where: { id: orderId },
            data: { status: 'approved', approvedAt: now },
          });
        } else {
          await tx.stockOutOrder.update({
            where: { id: orderId },
            data: { status: 'rejected', rejectedAt: now },
          });
        }

        return { success: true, decision: dto.decision };
      },
      { isolationLevel: 'Serializable' },
    );
  }

  async getApprovalHistory(businessType: string, businessId: string) {
    return this.prisma.approvalRecord.findMany({
      where: { businessType: businessType as any, businessId },
      include: {
        reviewer: { select: { id: true, username: true, fullName: true } },
      },
      orderBy: { reviewedAt: 'desc' },
    });
  }
}
