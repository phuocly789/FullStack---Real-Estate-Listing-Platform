// src/contacts/contacts.service.ts
import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { contactstatus } from '@prisma/client';
// import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createContactDto: CreateContactDto) {
    try {
      // Kiểm tra userId tồn tại
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`Người dùng với ID ${userId} không tồn tại`);
      }

      // Kiểm tra propertyId tồn tại
      const property = await this.prisma.property.findUnique({
        where: { id: createContactDto.propertyid },
      });
      if (!property) {
        throw new NotFoundException(`Bất động sản với ID ${createContactDto.propertyid} không tồn tại`);
      }

      // Tạo contact
      return await this.prisma.contact.create({
        data: {
          message: createContactDto.message,
          userid: userId,
          propertyid: createContactDto.propertyid,
          status: 'PENDING',
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Lỗi khi tạo liên hệ');
    }
  }

  async findAll(userId: number, role: string) {
    if (role === 'ADMIN') {
      return this.prisma.contact.findMany({
        include: { User: true, property: true },
      });
    }
    return this.prisma.contact.findMany({
        where: { userid: userId },
      include: { User: true, property: true },
    });
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    try {
      if (!Number.isInteger(id)) {
        throw new BadRequestException('ID liên hệ không hợp lệ');
      }

      // Kiểm tra liên hệ tồn tại
      const contact = await this.prisma.contact.findUnique({ where: { id } });
      if (!contact) {
        throw new NotFoundException(`Liên hệ với ID ${id} không tồn tại`);
      }

      const data: any = {
        updatedAt: new Date(),
      };

      if (updateContactDto.replyMessage) {
        data.replyMessage = updateContactDto.replyMessage;
      }

      if (updateContactDto.status) {
        if (!Object.values(contactstatus).includes(updateContactDto.status as contactstatus)) {
          throw new BadRequestException(`Trạng thái ${updateContactDto.status} không hợp lệ`);
        }
        data.status = updateContactDto.status as contactstatus;
      }

      return await this.prisma.contact.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi cập nhật liên hệ');
    }
  }
  

  async remove(id: number) {
    return this.prisma.contact.delete({ where: { id } });
  }
}