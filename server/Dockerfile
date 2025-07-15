FROM node:18-alpine

WORKDIR /app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./
# Cài đặt dependencies
RUN npm install

# Copy thư mục prisma để tạo Prisma Client
COPY prisma ./prisma
# Chạy lệnh để tạo Prisma Client
RUN npx prisma generate

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Khởi động ứng dụng
CMD ["npm", "start"]