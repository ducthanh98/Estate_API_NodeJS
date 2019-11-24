import { Injectable } from '@nestjs/common';
import { DatabaseHelper } from '../../../helpers/database.helper';
import { Like } from 'typeorm';
import { ReportTypeEntity } from './../../../database/reportType.entity';
import { ReportTypeDTO } from './reportType.dto';

@Injectable()
export class ReportTypeService {
    private databaseHelper: DatabaseHelper<ReportTypeEntity, ReportTypeDTO>;
    onModuleInit() {
        this.databaseHelper = new DatabaseHelper<ReportTypeEntity, ReportTypeDTO>(ReportTypeEntity);
    }
    getAllBy(pageNumber = 1, pageSize = 10, keyText = '') {
        const condition = [
            { reportContent: Like(`%${keyText}%`) },
        ];
        return this.databaseHelper.findAllBy(pageNumber, pageSize, condition);
    }
    create(reportType: ReportTypeDTO) {
        return this.databaseHelper.insert(reportType);
    }
    update(id: number, reportType: ReportTypeDTO) {
        return this.databaseHelper.update(id, reportType);
    }
    delete(id: number) {
        return this.databaseHelper.delete(id);
    }
}
