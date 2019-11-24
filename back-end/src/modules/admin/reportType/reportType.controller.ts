import { Controller, Post, Get, Body, UsePipes, Param, Res, UseGuards } from '@nestjs/common';
import { IReponse } from '../../../shared/interface/ireponse.interface';
import { Code } from '../../../constants/code.enum';
import { Response } from 'express';
import { AmentitiesEntity } from './../../../database/amentities.entity';
import { NotificationContant } from './../../../constants/notification.constant';
import { BodyDTO } from './../../../shared/class/body.dto';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { AuthGuard } from './../../../shared/guards/auth.guard';
import { ReportTypeService } from './reportType.service';
import { ReportTypeDTO } from './reportType.dto';
import { ReportTypeEntity } from './../../../database/reportType.entity';
import { Ilist } from './../../../shared/interface/IList.interface';

@Controller('admin/report-type')
@UseGuards(new AuthGuard())
export class ReportTypeController {
    constructor(private reportTypeService: ReportTypeService) { }

    @Post('getAllBy')
    @UsePipes(new ValidationPipe())
    getAllBy(@Res() res: Response, @Body() data: BodyDTO) {
        return this.reportTypeService.getAllBy(data.pageNumber, data.pageSize, data.keyText)
            .subscribe(
                (reportType: Ilist<ReportTypeEntity>) => {
                    const response: IReponse<Ilist<ReportTypeEntity>> = {
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
    @UsePipes(new ValidationPipe())
    create(@Res() res: Response, @Body() data: ReportTypeDTO) {
        return this.reportTypeService.create(data)
            .subscribe(
                (reportType: ReportTypeEntity) => {
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
    @UsePipes(new ValidationPipe())
    update(@Res() res: Response, @Body() data: ReportTypeDTO, @Param('id') id: number) {
        return this.reportTypeService.update(id, data)
            .subscribe(
                (message: string) => {
                    const response: IReponse<any> = {
                        statusCode: Code.SUCCESS,
                        message,
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

    @Get('delete/:id')
    delete(@Res() res: Response, @Param('id') id: number) {
        return this.reportTypeService.delete(id)
            .subscribe(
                (message: string) => {
                    const response: IReponse<any> = {
                        statusCode: Code.SUCCESS,
                        message,
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
