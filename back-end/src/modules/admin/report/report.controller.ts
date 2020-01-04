import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Res, Body, Req, Param } from '@nestjs/common';
import { AuthGuard } from './../../../shared/guards/auth.guard';
import { InsertReportDTO } from './insertReport.dto';
import { IReponse } from './../../../shared/interface/ireponse.interface';
import { NotificationContant } from './../../../constants/notification.constant';
import { ReportService } from './report.service';
import { Code } from './../../../constants/code.enum';
import { ReportEntity } from './../../../database/entities/report.entity';
import { BodyDTO } from './../../../shared/class/body.dto';
import { Ilist } from '../../../shared/interface/IList.interface';

@Controller('admin/report')
export class ReportController {
    constructor(private reportService: ReportService) { }
    @Post('getAllBy')
    @UsePipes(new ValidationPipe())
    getAllBy(@Res() res, @Body() data: BodyDTO) {
        return this.reportService.getAllBy(data.pageNumber, data.pageSize, data.keyText)
            .subscribe(
                (reportType: Ilist<ReportEntity>) => {
                    const response: IReponse<Ilist<ReportEntity>> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: reportType,
                    };
                    res.json(response);
                }, (err) => {
                    const response: IReponse<any> = {
                        statusCode: Code.ERROR,
                        message: err.message,
                    };
                    res.json(response);
                },
            );
    }
    @Post('create')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    create(@Res() res, @Req() req, @Body() data: InsertReportDTO) {
        return this.reportService.create(data, req.user.id)
            .subscribe(
                (reportType: any) => {
                    const response: IReponse<any> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: reportType,
                    };
                    res.json(response);
                }, (err) => {
                    const response: IReponse<any> = {
                        statusCode: Code.ERROR,
                        message: err.message,
                    };
                    res.json(response);
                },
            );
    }
    @Post('update/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    update(@Res() res, @Req() req, @Param('id') id, @Body() data: any) {
        return this.reportService.update(id, data, req.user.id)
            .subscribe(
                (reportType: any) => {
                    const response: IReponse<any> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: reportType,
                    };
                    res.json(response);
                }, (err) => {
                    const response: IReponse<any> = {
                        statusCode: Code.ERROR,
                        message: err.message,
                    };
                    res.json(response);
                },
            );
    }
}
