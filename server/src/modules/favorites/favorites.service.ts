// src/favorites/favorites.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, propertyId: number) {
    return this.prisma.favorite.create({
      data: {
       userid: userId,
       propertyid: propertyId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userid:userId },
      include: { property: true },
    });
  }

  async remove(userId: number, propertyId: number) {
    return this.prisma.favorite.deleteMany({
      where: { userid:userId, propertyid:propertyId },
    });
  }
}