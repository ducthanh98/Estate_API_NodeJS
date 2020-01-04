import { IsNotEmpty, IsNumber } from 'class-validator';

export class ActiveDTO {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}