// src/favorites/favorites.controller.ts
import { Controller, Get, Post, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':propertyId')
  async create(@Request() req, @Param('propertyId') propertyId: string) {
    return this.favoritesService.create(req.user.userId, +propertyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':propertyId')
  async remove(@Request() req, @Param('propertyId') propertyId: string) {
    return this.favoritesService.remove(req.user.userId, +propertyId);
  }
}