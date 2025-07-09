// src/contacts/contacts.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { contactstatus } from '@prisma/client';
// import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createContactDto: CreateContactDto) {
    return this.prisma.contact.create({
      data: {
        ...createContactDto,
        userid: userId, 
        propertyid: createContactDto.propertyid,
        message: createContactDto.message,
        status:'PENDING'
      },
    });
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
    const data: any = {
      updatedAt: new Date(),
    };
  
    if (updateContactDto.replyMessage) {
      data.replyMessage = updateContactDto.replyMessage;
    }
  
    if (updateContactDto.status && Object.values(contactstatus).includes(updateContactDto.status as contactstatus)) {
      data.status = updateContactDto.status as contactstatus;
    }
  
    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }
  

  async remove(id: number) {
    return this.prisma.contact.delete({ where: { id } });
  }
}