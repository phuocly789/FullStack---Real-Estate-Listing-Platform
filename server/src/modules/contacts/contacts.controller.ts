// src/contacts/contacts.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
// import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createContactDto: CreateContactDto) {
    try {
      return await this.contactsService.create(req.user.userId, createContactDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Lỗi khi tạo liên hệ');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.contactsService.findAll(req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    try {
      // Kiểm tra quyền admin
      if (req.user.role !== 'ADMIN') {
        throw new ForbiddenException('Chỉ admin mới có thể cập nhật liên hệ');
      }
      return await this.contactsService.update(+id, updateContactDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Lỗi khi cập nhật liên hệ');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}