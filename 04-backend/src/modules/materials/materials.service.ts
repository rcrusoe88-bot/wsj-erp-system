import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.material.findMany({
      include: {
        createdBy: { select: { id: true, username: true, fullName: true } },
        updatedBy: { select: { id: true, username: true, fullName: true } },
      },
    });
  }

  async findById(id: string) {
    const material = await this.prisma.material.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, username: true, fullName: true } },
        updatedBy: { select: { id: true, username: true, fullName: true } },
      },
    });
    if (!material) {
      throw new NotFoundException('物料不存在');
    }
    return material;
  }

  async create(dto: CreateMaterialDto, createdById: string) {
    const existing = await this.prisma.material.findUnique({
      where: { materialCode: dto.materialCode },
    });
    if (existing) {
      throw new BadRequestException('物料编码已存在');
    }

    return this.prisma.material.create({
      data: {
        materialCode: dto.materialCode,
        materialName: dto.materialName,
        materialCategory: dto.materialCategory,
        specification: dto.specification,
        unit: dto.unit,
        batchManaged: dto.batchManaged ?? true,
        expiryManaged: dto.expiryManaged ?? true,
        storageCondition: dto.storageCondition,
        remark: dto.remark,
        createdById,
      },
      include: {
        createdBy: { select: { id: true, username: true, fullName: true } },
      },
    });
  }

  async update(id: string, dto: UpdateMaterialDto, updatedById: string) {
    const material = await this.prisma.material.findUnique({ where: { id } });
    if (!material) {
      throw new NotFoundException('物料不存在');
    }

    return this.prisma.material.update({
      where: { id },
      data: { ...dto, updatedById },
      include: {
        createdBy: { select: { id: true, username: true, fullName: true } },
        updatedBy: { select: { id: true, username: true, fullName: true } },
      },
    });
  }
}
