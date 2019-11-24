import { IsString, IsNotEmpty } from 'class-validator';

export class ReportTypeDTO {
    @IsString()
    @IsNotEmpty()
    reportContent: string;
}
