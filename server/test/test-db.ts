import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    const users = await prisma.user.findMany();
    console.log('Kết nối thành công! User count:', users.length);
  } catch (err) {
    console.error('Lỗi khi kết nối DB:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
