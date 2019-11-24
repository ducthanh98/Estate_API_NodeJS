export class ReportTypeEntity {
    id: number;
    reportContent: string;
}

export class ReportType {
    list: ReportTypeEntity[];
    total: number;
}
