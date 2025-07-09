// prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Cho phép dùng toàn app nếu muốn
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
