import { Injectable } from '@nestjs/common';
import { ReportEntity } from './../../../database/entities/report.entity';
import { InsertReportDTO } from './insertReport.dto';
import { DatabaseHelper } from './../../../helpers/database.helper';
import { UserEntity } from './../../../database/entities/user.entity';
import { UserDTO } from './../../auth/dto/user.dto';
import { ReportTypeEntity } from './../../../database/entities/reportType.entity';
import { ReportTypeDTO } from './../reportType/reportType.dto';
import { forkJoin } from 'rxjs';
import { HouseEntity } from './../../../database/entities/house.entity';
import { RentHostelDTO } from './../../rent-hostel/dto/rent-hostel.dto';
import { switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { NotificationContant } from './../../../constants/notification.constant';
import { Role } from './../../../constants/role.enum';

@Injectable()
export class ReportService {
    private databaseHelper: DatabaseHelper<ReportEntity, InsertReportDTO>;
    private userHelper: DatabaseHelper<UserEntity, UserDTO>;
    private reportTypeHelper: DatabaseHelper<ReportTypeEntity, ReportTypeDTO>;
    private postHelper: DatabaseHelper<HouseEntity, RentHostelDTO>;
    onModuleInit() {
        this.databaseHelper = new DatabaseHelper<ReportEntity, InsertReportDTO>(ReportEntity);
        this.userHelper = new DatabaseHelper<UserEntity, UserDTO>(UserEntity);
        this.reportTypeHelper = new DatabaseHelper<ReportTypeEntity, ReportTypeDTO>(ReportTypeEntity);
        this.postHelper = new DatabaseHelper<HouseEntity, RentHostelDTO>(HouseEntity);
    }
    getAllBy(pageNumber = 1, pageSize = 10, keyText = '') {
        const relations = ['reportType', 'post'];
        const orderOptions = { status: 'ASC' };
        return this.databaseHelper.findAllBy(pageNumber, pageSize, {}, relations, orderOptions);
    }
    create(reportDTO: any, uid) {
        return this.getRelationInfo(reportDTO.postId, reportDTO.reportTypeId, uid)
            .pipe(
                switchMap(value => {
                    if (!value[0] || !value[1] || !value[2]) {
                        return throwError(new Error(NotificationContant.ID_NOT_MATCH));
                    }
                    const dataToInsert: any = {
                        author: value[1],
                        post: value[0],
                        reportType: value[2],
                    };
                    return this.databaseHelper.insert(dataToInsert);
                }),
            );
    }
    update(id: number, reportDTO: any, userId) {
        return this.userHelper.findOne('id', userId)
            .pipe(
                switchMap(value => {
                    if (!value) {
                        return throwError(new Error(NotificationContant.ID_NOT_MATCH));
                    } else if (value.role > Role.SUBADMIN) {
                        return throwError(new Error(NotificationContant.NOT_PERMISSION));
                    } else {
                        return this.databaseHelper.update(id, reportDTO);
                    }
                }),
            );
    }
    delete(id: number) {
        return this.databaseHelper.delete(id);
    }
    getRelationInfo(postId, reportTypeId, uid) {
        return forkJoin(
            [
                this.postHelper.findOne('id', postId),
                this.userHelper.findOne('id', uid),
                this.reportTypeHelper.findOne('id', reportTypeId),
            ],
        );
    }
}
