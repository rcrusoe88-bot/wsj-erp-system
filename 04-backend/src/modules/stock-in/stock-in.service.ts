import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { UpdateStockInDto } from './dto/update-stock-in.dto';
import { generateOrderNo } from '../../common/utils/order-no';

@Injectable()
export class StockInService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { status?: string; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = params;
    const where = status ? { status: status as any } : {};

    const [items, total] = await Promise.all([
      this.prisma.stockInOrder.findMany({
        where,
        include: {
          applicant: { select: { id: true, username: true, fullName: true } },
          warehouse: { select: { id: true, warehouseCode: true, warehouseName: true } },
          items: {
            include: {
              material: { select: { id: true, materialCode: true, materialName: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.stockInOrder.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string) {
    const order = await this.prisma.stockInOrder.findUnique({
      where: { id },
      include: {
        applicant: { select: { id: true, username: true, fullName: true } },
        warehouse: { select: { id: true, warehouseCode: true, warehouseName: true } },
        items: {
          include: {
            material: { select: { id: true, materialCode: true, materialName: true } },
            sources: {
              include: {
                upstreamMaterial: { select: { id: true, materialCode: true, materialName: true } },
              },
            },
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException('入库单不存在');
    }
    return order;
  }

  async create(dto: CreateStockInDto, applicantId: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('入库单至少需要一个物料项');
    }

    const orderNo = generateOrderNo('SI');

    return this.prisma.stockInOrder.create({
      data: {
        orderNo,
        stockInType: dto.stockInType,
        status: 'draft',
        applicantId,
        warehouseId: dto.warehouseId,
        sourceReference: dto.sourceReference,
        remark: dto.remark,
        items: {
          create: dto.items.map((item) => ({
            materialId: item.materialId,
            lotNumber: item.lotNumber,
            quantity: item.quantity,
            unit: item.unit,
            productionDate: item.productionDate ? new Date(item.productionDate) : null,
            expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
            remark: item.remark,
            sources: item.sources?.length
              ? {
                  create: item.sources.map((s) => ({
                    upstreamMaterialId: s.upstreamMaterialId,
                    upstreamLotNumber: s.upstreamLotNumber,
                    consumedQuantity: s.consumedQuantity,
                    remark: s.remark,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        items: {
          include: {
            material: { select: { id: true, materialCode: true, materialName: true } },
            sources: {
              include: {
                upstreamMaterial: { select: { id: true, materialCode: true, materialName: true } },
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateStockInDto) {
    const order = await this.prisma.stockInOrder.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('入库单不存在');
    }
    if (order.status !== 'draft') {
      throw new BadRequestException('只能编辑草稿状态的入库单');
    }

    const updateData: any = {};
    if (dto.sourceReference !== undefined) updateData.sourceReference = dto.sourceReference;
    if (dto.remark !== undefined) updateData.remark = dto.remark;

    if (dto.items) {
      await this.prisma.stockInOrderItem.deleteMany({ where: { stockInOrderId: id } });
      updateData.items = {
        create: dto.items.map((item) => ({
          materialId: item.materialId,
          lotNumber: item.lotNumber,
          quantity: item.quantity,
          unit: item.unit,
          productionDate: item.productionDate ? new Date(item.productionDate) : null,
          expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
          remark: item.remark,
          sources: item.sources?.length
            ? {
                create: item.sources.map((s) => ({
                  upstreamMaterialId: s.upstreamMaterialId,
                  upstreamLotNumber: s.upstreamLotNumber,
                  consumedQuantity: s.consumedQuantity,
                  remark: s.remark,
                })),
              }
            : undefined,
        })),
      };
    }

    return this.prisma.stockInOrder.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            material: { select: { id: true, materialCode: true, materialName: true } },
          },
        },
      },
    });
  }

  async submit(id: string) {
    const order = await this.prisma.stockInOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException('入库单不存在');
    }
    if (order.status !== 'draft') {
      throw new BadRequestException('只能提交草稿状态的入库单');
    }
    if (order.items.length === 0) {
      throw new BadRequestException('入库单至少需要一个物料项');
    }

    return this.prisma.stockInOrder.update({
      where: { id },
      data: { status: 'pending_review', submittedAt: new Date() },
    });
  }
}
