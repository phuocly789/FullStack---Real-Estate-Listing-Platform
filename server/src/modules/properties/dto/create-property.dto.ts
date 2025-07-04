// src/properties/dto/create-property.dto.ts
export class CreatePropertyDto {
  title: string;
  description: string;
  price: number;
  area: number;
  location: string;
  latitude?: number;
  longitude?: number;
  type: 'HOUSE' | 'APARTMENT' | 'LAND';
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
}