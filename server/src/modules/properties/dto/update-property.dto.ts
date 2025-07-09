// src/properties/dto/update-property.dto.ts
export class UpdatePropertyDto {
  title?: string;
  description?: string;
  price?: number;
  area?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  type?: 'HOUSE' | 'APARTMENT' | 'LAND';
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
}