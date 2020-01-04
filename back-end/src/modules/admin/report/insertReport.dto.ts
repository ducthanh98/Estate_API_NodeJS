import { IsNumber, IsNotEmpty } from 'class-validator';

export class InsertReportDTO {
    @IsNumber()
    reportTypeId: number;
    @IsNumber()
    postId: number;
}
