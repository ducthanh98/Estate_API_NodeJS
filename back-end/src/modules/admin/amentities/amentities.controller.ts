import { Controller, Post, UseInterceptors, UploadedFile, Get, Body, UsePipes, Put, Param, Delete, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AmentitiesService } from './amentities.service';
import { AmentitiesDTO } from './amentities.dto';
import { IReponse } from '../../../shared/interface/ireponse.interface';
import { Code } from '../../../constants/code.enum';
import { Response } from 'express';
import { AmentitiesEntity } from './../../../database/amentities.entity';
import { NotificationContant } from './../../../constants/notification.constant';
import { AmentitiesRO } from './amentities.ro';
import { BodyDTO } from './../../../shared/class/body.dto';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';

@Controller('admin/amentities')
export class AmentitiesController {
    constructor(private amentitiesService: AmentitiesService) { }
    @Post('getAllBy')
    @UsePipes(new ValidationPipe())
    getAllBy(@Res() res: Response, @Body() data: BodyDTO) {
        return this.amentitiesService.getAllBy(data.pageNumber, data.pageSize, data.keyText)
            .subscribe(
                (amentities: AmentitiesRO) => {
                    const response: IReponse<any> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: amentities,
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
    create(@Res() res: Response, @Body() data: AmentitiesDTO) {
        return this.amentitiesService.create(data)
            .subscribe(
                (amentities: AmentitiesEntity) => {
                    const response: IReponse<any> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: amentities,
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
    update(@Res() res: Response, @Body() data: AmentitiesDTO, @Param('id') id: number) {
        return this.amentitiesService.update(id, data)
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
        return this.amentitiesService.delete(id)
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
