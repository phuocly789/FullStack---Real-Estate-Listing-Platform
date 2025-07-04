// src/properties/properties.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(req.user.userId, createPropertyDto);
  }

  @Get()
  async findAll(
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('areaMin') areaMin?: string,
    @Query('areaMax') areaMax?: string,
    @Query('location') location?: string,
    @Query('type') type?: string,
  ) {
    return this.propertiesService.findAll({
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      areaMin: areaMin ? parseFloat(areaMin) : undefined,
      areaMax: areaMax ? parseFloat(areaMax) : undefined,
      location,
      type,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.propertiesService.remove(+id);
  }
}