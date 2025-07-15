// src/contacts/dto/update-contact.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateContactDto {
  @IsString()
  @IsOptional()
  replymessage?: string;

  @IsIn(['PENDING', 'RESPONDED', 'CLOSED'])
  @IsOptional()
  status?: string;
}