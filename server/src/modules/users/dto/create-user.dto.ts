// src/users/dto/create-user.dto.ts
export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
  }