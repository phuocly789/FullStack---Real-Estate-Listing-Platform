import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ log: ['query', 'info', 'warn', 'error'] });
  }
  async onModuleInit() {
    console.log('[PrismaService] DATABASE_URL =', process.env.DATABASE_URL);
    try {
      console.log('Đang kết nối đến cơ sở dữ liệu...');
      await this.$connect();
      console.log('Kết nối thành công!');
    } catch (error) {
      console.error('Lỗi khi kết nối:', error);
      throw error;
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}