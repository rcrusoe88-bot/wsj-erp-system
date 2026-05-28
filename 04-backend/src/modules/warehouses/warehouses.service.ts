import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.warehouse.findMany({
      include: {
        createdBy: { select: { id: true, username: true, fullName: true } },
        updatedBy: { select: { id: true, username: true, fullName: true } },
      },
    });
  }

  async findById(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, username: true, fullName: true } },
        updatedBy: { select: { id: true, username: true, fullName: true } },
      },
    });
    if (!warehouse) {
      throw new NotFoundException('仓库不存在');
    }
    return warehouse;
  }

  async create(dto: CreateWarehouseDto, createdById: string) {
    const existing = await this.prisma.warehouse.findUnique({
      where: { warehouseCode: dto.warehouseCode },
    });
    if (existing) {
      throw new BadRequestException('仓库编码已存在');
    }

    return this.prisma.warehouse.create({
      data: {
        warehouseCode: dto.warehouseCode,
        warehouseName: dto.warehouseName,
        location: dto.location,
        remark: dto.remark,
        createdById,
      },
      include: {
        createdBy: { select: { id: true, username: true, fullName: true } },
      },
    });
  }

  async update(id: string, dto: UpdateWarehouseDto, updatedById: string) {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException('仓库不存在');
    }

    return this.prisma.warehouse.update({
      where: { id },
      data: { ...dto, updatedById },
      include: {
        createdBy: { select: { id: true, username: true, fullName: true } },
        updatedBy: { select: { id: true, username: true, fullName: true } },
      },
    });
  }
}
