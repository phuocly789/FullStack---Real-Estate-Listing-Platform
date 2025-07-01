export class CreatePropertyDto {
    title: string;
    description: string;
    price: number;
    area: number;
    location: string;
    type: string;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    userId: number;
  }