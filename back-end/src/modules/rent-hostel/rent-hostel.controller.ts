import { Controller, Post, UseInterceptors, UploadedFiles, Body, Res, Get, UsePipes, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RentHostelDTO } from './dto/rent-hostel.dto';
import { Response } from 'express';
import { RentHostelService } from './rent-hostel.service';
import { IReponse } from 'src/shared/interface/ireponse.interface';
import { NotificationContant } from 'src/constants/notification.constant';
import { Code } from 'src/constants/code.enum';
import { PostEntity } from './../../database/post.entity';
import { UserDTO } from '../auth/dto/user.dto';
import { ValidationPipe } from './../../shared/pipes/validation.pipe';
import { BodyDTO } from '../../shared/class/body.dto';
import { Ilist } from '../..//shared/interface/IList.interface';
import { PostRO } from './ro/post.ro';

@Controller('rent-hostel')
export class RentHostelController {
    constructor(private rentHostelService: RentHostelService) { }

    @Post('getAllBy')
    @UsePipes(new ValidationPipe())
    getAllBy(@Res() res: Response, @Body() data: BodyDTO) {
        return this.rentHostelService.getAllBy(data.pageNumber, data.pageSize, data.keyText)
            .subscribe(
                (hostel: Ilist<PostEntity>) => {
                    const response: IReponse<Ilist<PostEntity>> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: hostel,
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

    @Get('getById/:id')
    @UsePipes(new ValidationPipe())
    getById(@Res() res: Response, @Param('id') id: number) {
        return this.rentHostelService.getById(id)
            .subscribe(
                (hostel: PostEntity) => {
                    console.log(hostel)
                    const hostelRO: PostRO = { ...hostel, author: hostel.author.toResponseObject() };
                    const response: IReponse<PostRO> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: hostelRO,
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
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@UploadedFiles() files, @Body() data: RentHostelDTO, @Res() res: Response) {
        return this.rentHostelService.createGallery(files, data)
            .subscribe(
                (value) => {
                    const response: IReponse<PostEntity> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                    };
                    res.json(response);
                }, (err) => {
                    const response: IReponse<PostEntity> = {
                        statusCode: Code.ERROR,
                        message: err.message,
                    };
                    res.json(response);
                },
            );
    }
}
