// src/properties/properties.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Prisma, propertytype } from '@prisma/client'; // ✅ enum đúng tên

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
    title?: string;
    location?: string;
    priceSort?: 'asc' | 'desc';
    areaSort?: 'asc' | 'desc';
     createdAtSort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const where: Prisma.propertyWhereInput = {
      title: filters.title ? { contains: filters.title, mode: 'insensitive' } : undefined,
      location: filters.location ? { contains: filters.location, mode: 'insensitive' } : undefined,
    };
  
    const orderBy: Prisma.propertyOrderByWithRelationInput[] = [];
    if (filters.priceSort) orderBy.push({ price: filters.priceSort });
    if (filters.areaSort) orderBy.push({ area: filters.areaSort });
  if (filters.createdAtSort) orderBy.push({ createdat: filters.createdAtSort });
  
    const skip = filters.page && filters.limit ? (filters.page - 1) * filters.limit : undefined;
    const take = filters.limit;
  
    const [properties, totalCount] = await Promise.all([
      this.prisma.property.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          title: true,
          price: true,
          area: true,
          location: true,
          images: true,
          type: true,
          bedrooms: true,
          description: true,
          bathrooms: true,
          createdat: true,
          updatedat: true,
        },
      }),
      this.prisma.property.count({ where }),
    ]);
  
    return { data: properties, totalCount };
  }
  
  
  
  
  
  async findOne(id: number) {
    return this.prisma.property.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        price: true,
        area: true,
        location: true,
        images: true,
        type: true,
        bedrooms: true,
        description:true,
        bathrooms: true,
        userid:true,
        longitude:true,
        latitude:true,
        createdat: true,
        updatedat: true,
      },
    });
  }
  async countByUser(userId: number) {
    return this.prisma.property.count({
      where: { userid: userId },
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