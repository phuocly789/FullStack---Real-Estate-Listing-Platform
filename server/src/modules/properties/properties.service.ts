// src/properties/properties.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { propertytype } from '@prisma/client'; // ✅ enum đúng tên

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createPropertyDto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: {
        ...createPropertyDto,
        userid:userId,
      },
    });
  }

  async findAll(filters: {
    priceMin?: number;
    priceMax?: number;
    areaMin?: number;
    areaMax?: number;
    location?: string;
    type?: string;
  }) {
    const allowedTypes = Object.values(propertytype);  // ['HOUSE', 'APARTMENT', ...]
  
    const typeFilter = allowedTypes.includes(filters.type as any)
      ? (filters.type as propertytype)
      : undefined;
  
    return this.prisma.property.findMany({
      where: {
        price: {
          gte: filters.priceMin,
          lte: filters.priceMax,
        },
        area: {
          gte: filters.areaMin,
          lte: filters.areaMax,
        },
        location: filters.location ? { contains: filters.location } : undefined,
        type: typeFilter,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.property.findUnique({
      where: { id },
      include: { User: { select: { id: true, name: true, email: true, phone: true } } },
    });
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return this.prisma.property.update({
      where: { id },
      data: updatePropertyDto,
    });
  }

  async remove(id: number) {
    return this.prisma.property.delete({ where: { id } });
  }
}