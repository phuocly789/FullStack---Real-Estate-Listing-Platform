// src/contacts/contacts.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
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

//   async update(id: number, updateContactDto: UpdateContactDto) {
//     return this.prisma.contact.update({
//       where: { id },
//       data: updateContactDto,
//     });
//   }

  async remove(id: number) {
    return this.prisma.contact.delete({ where: { id } });
  }
}