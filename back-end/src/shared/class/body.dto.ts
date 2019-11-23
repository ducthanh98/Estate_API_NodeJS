import { IsNumber, IsString, Min, IsNotEmpty } from 'class-validator';

export class BodyDTO {
    @IsNumber()
    @Min(1)
    pageNumber: number;
    @IsNumber()
    pageSize: number;
    @IsString()
    keyText: string;
}