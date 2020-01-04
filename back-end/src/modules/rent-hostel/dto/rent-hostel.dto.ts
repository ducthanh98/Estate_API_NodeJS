import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class RentHostelDTO {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsString()
    @IsNotEmpty()
    location: string;
    @IsNumber()
    bedrooms: number;
    @IsNumber()
    bathrooms: number;
    @IsNumber()
    area: number;
    @IsNumber()
    price: number;
    @IsString()
    @IsNotEmpty()
    description: string;
    @IsNumber()
    userId: number;
    amentities: any;
    @IsNumber()
    lat: number;
    @IsNumber()
    lng: number;
}
