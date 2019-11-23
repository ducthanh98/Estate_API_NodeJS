import { Controller, Post, UseInterceptors, UploadedFile, Get, Body, UsePipes, ValidationPipe, Put, Param, Delete, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AmentitiesService } from './amentities.service';
import { AmentitiesDTO } from './amentities.dto';
import { IReponse } from '../../../shared/interface/ireponse.interface';
import { Code } from '../../../constants/code.enum';
import { Response } from 'express';

@Controller('admin/amentities')
export class AmentitiesController {
    constructor(private amentitiesService: AmentitiesService) { }
    @Post('getAllBy')
    getAllBy() {
        return this.amentitiesService.getAllBy();
    }

    @Post('create')
    @UsePipes(new ValidationPipe())
    create(@Body() data: AmentitiesDTO) {
        return this.amentitiesService.create(data);
    }

    @Put('update/:id')
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

    @Delete('delete/:id')
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
