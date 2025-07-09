// src/contacts/dto/update-contact.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateContactDto {
  @IsString()
  @IsOptional()
  replyMessage?: string;

  @IsIn(['PENDING', 'REPLIED'])
  @IsOptional()
  status?: string;
}