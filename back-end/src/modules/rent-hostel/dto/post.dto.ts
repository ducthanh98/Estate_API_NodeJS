import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { UserEntity } from '../../../database/entities/user.entity';

export class PostDTO {
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
    author: UserEntity;
    @IsNumber()
    lat: number;
    @IsNumber()
    lng: number;
}
