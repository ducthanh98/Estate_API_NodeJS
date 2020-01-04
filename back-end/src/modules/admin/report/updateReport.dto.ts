import { IsNumber, IsNotEmpty } from 'class-validator';

export class ReportDTO {
    @IsNumber()
    id: number;
    @IsNotEmpty()
    status: boolean;
}
