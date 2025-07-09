// src/users/users.service.ts
import { Injectable, ConflictException, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
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
       // Kiểm tra email trùng
       const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      console.log('Existing user by email check:', existingUserByEmail);
      if (existingUserByEmail) {
        throw new ConflictException('Email đã tồn tại');
      }

      // Kiểm tra số điện thoại trùng (nếu có phone)
      if (createUserDto.phone) {
        const existingUserByPhone = await this.prisma.user.findFirst({
          where: { phone: createUserDto.phone },
        });
        console.log('Existing user by phone check:', existingUserByPhone);
        if (existingUserByPhone) {
          throw new ConflictException('Số điện thoại đã tồn tại');
        }
      }

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
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          createdAt: true,
        },
      });
      if (!user) {
        throw new BadRequestException('Người dùng không tồn tại');
      }
      return user;
    } catch (error) {
      console.error('Error in findById:', error);
      throw new InternalServerErrorException('Lỗi server khi lấy thông tin người dùng');
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true,createdAt:true, avatar:true},
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      // Kiểm tra số điện thoại trùng (nếu có phone trong updateUserDto)
      if (updateUserDto.phone) {
        const existingUserByPhone = await this.prisma.user.findFirst({
          where: { phone: updateUserDto.phone },
        });
        if (existingUserByPhone && existingUserByPhone.id !== id) {
          throw new ConflictException('Số điện thoại đã tồn tại');
        }
      }

      return await this.prisma.user.update({
        where: { id },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          phone: updateUserDto.phone,
          avatar: updateUserDto.avatar || null,
        },
        select: { id: true, name: true, email: true, phone: true, avatar: true, role: true },
      });
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async changePassword(id: number, oldPassword: string, newPassword: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new BadRequestException('Người dùng không tồn tại');
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword },
      });

      return { message: 'Đổi mật khẩu thành công' };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async deleteAccount(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new BadRequestException('Người dùng không tồn tại');
      }

      await this.prisma.user.delete({ where: { id } });
      return { message: 'Yêu cầu xóa tài khoản đã được xử lý' };
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
}