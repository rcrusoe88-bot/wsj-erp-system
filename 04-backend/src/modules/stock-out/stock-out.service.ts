import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStockOutDto } from './dto/create-stock-out.dto';
import { UpdateStockOutDto } from './dto/update-stock-out.dto';
import { generateOrderNo } from '../../common/utils/order-no';

@Injectable()
export class StockOutService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { status?: string; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = params;
    const where = status ? { status: status as any } : {};

    const [items, total] = await Promise.all([
      this.prisma.stockOutOrder.findMany({
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
      this.prisma.stockOutOrder.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string) {
    const order = await this.prisma.stockOutOrder.findUnique({
      where: { id },
      include: {
        applicant: { select: { id: true, username: true, fullName: true } },
        warehouse: { select: { id: true, warehouseCode: true, warehouseName: true } },
        items: {
          include: {
            material: { select: { id: true, materialCode: true, materialName: true } },
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException('出库单不存在');
    }
    return order;
  }

  async create(dto: CreateStockOutDto, applicantId: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('出库单至少需要一个物料项');
    }

    const orderNo = generateOrderNo('SO');

    return this.prisma.stockOutOrder.create({
      data: {
        orderNo,
        stockOutType: dto.stockOutType,
        status: 'draft',
        applicantId,
        warehouseId: dto.warehouseId,
        destination: dto.destination,
        remark: dto.remark,
        items: {
          create: dto.items.map((item) => ({
            materialId: item.materialId,
            lotNumber: item.lotNumber,
            quantity: item.quantity,
            unit: item.unit,
            remark: item.remark,
          })),
        },
      },
      include: {
        items: {
          include: {
            material: { select: { id: true, materialCode: true, materialName: true } },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateStockOutDto) {
    const order = await this.prisma.stockOutOrder.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('出库单不存在');
    }
    if (order.status !== 'draft') {
      throw new BadRequestException('只能编辑草稿状态的出库单');
    }

    const updateData: any = {};
    if (dto.destination !== undefined) updateData.destination = dto.destination;
    if (dto.remark !== undefined) updateData.remark = dto.remark;

    if (dto.items) {
      await this.prisma.stockOutOrderItem.deleteMany({ where: { stockOutOrderId: id } });
      updateData.items = {
        create: dto.items.map((item) => ({
          materialId: item.materialId,
          lotNumber: item.lotNumber,
          quantity: item.quantity,
          unit: item.unit,
          remark: item.remark,
        })),
      };
    }

    return this.prisma.stockOutOrder.update({
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
    const order = await this.prisma.stockOutOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException('出库单不存在');
    }
    if (order.status !== 'draft') {
      throw new BadRequestException('只能提交草稿状态的出库单');
    }
    if (order.items.length === 0) {
      throw new BadRequestException('出库单至少需要一个物料项');
    }

    return this.prisma.stockOutOrder.update({
      where: { id },
      data: { status: 'pending_review', submittedAt: new Date() },
    });
  }
}
