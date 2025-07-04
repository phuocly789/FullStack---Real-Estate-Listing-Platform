// src/users/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async create(createUserDto) {
    try {
      console.log('Received data:', createUserDto);
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      console.log('Existing user check:', existingUser);
      if (existingUser) throw new ConflictException('Email already exists');

      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      console.log('Hashed password:', hashedPassword);

      console.log('Creating user in Prisma...');
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          phone: createUserDto.phone || null,
          password: hashedPassword,
          role: 'USER', // Đảm bảo sử dụng giá trị từ enum Role
          avatar: createUserDto.avatar || null,
        },
        select: { id: true, name: true, email: true, phone: true, role: true, avatar: true },
      });
      console.log('User created:', user);

      console.log('Generating JWT...');
      return { message: 'User registered successfully' };
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, phone: true, avatar: true, role: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: { id: true, name: true, email: true, phone: true, avatar: true, role: true },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}