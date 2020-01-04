import { Controller, Post, UseInterceptors, UploadedFiles, Body, Res, Get, UsePipes, Param, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RentHostelDTO } from './dto/rent-hostel.dto';
import { Response } from 'express';
import { RentHostelService } from './rent-hostel.service';
import { IReponse } from '../../shared/interface/ireponse.interface';
import { NotificationContant } from '../../constants/notification.constant';
import { Code } from '../../constants/code.enum';
import { HouseEntity } from '../../database/entities/house.entity';
import { ValidationPipe } from './../../shared/pipes/validation.pipe';
import { BodyDTO } from '../../shared/class/body.dto';
import { Ilist } from '../..//shared/interface/IList.interface';
import { PostRO } from './ro/post.ro';
import { SearchProperties } from './dto/searchProperties.dto';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Controller('rent-hostel')
export class RentHostelController {
    constructor(private rentHostelService: RentHostelService) { }

    @Post('getAllBy')
    @UsePipes(new ValidationPipe())
    getAllBy(@Res() res: Response, @Body() data: BodyDTO) {
        return this.rentHostelService.getAllBy(data.pageNumber, data.pageSize, data.keyText)
            .subscribe(
                (hostel: Ilist<HouseEntity>) => {
                    const response: IReponse<Ilist<HouseEntity>> = {
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
    @Get('getNewest')
    getNewest(@Res() res: Response) {
        return this.rentHostelService.getNewest()
            .subscribe(
                (hostel: HouseEntity[]) => {
                    const response: IReponse<HouseEntity[]> = {
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
    @Post('searchAdvanced')
    searchAdvanced(@Res() res: Response, @Body() data: SearchProperties) {
        return this.rentHostelService.searchAdvanced(data)
            .subscribe(
                (hostel: Ilist<HouseEntity>) => {
                    const response: IReponse<Ilist<HouseEntity>> = {
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
                (hostel: HouseEntity) => {
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
    uploadFile(@UploadedFiles() files, @Body() data: RentHostelDTO, @Res() res: Response, @Req() req) {
        return this.rentHostelService.createGallery(files, data)
            .subscribe(
                (value) => {
                    const url = `${req.protocol}://localhost:4200/pages/rent-hostel/hostel-detail/${value[1].id}`;
                    this.rentHostelService.notifyNewPost(url).pipe(catchError((e => of(e))))
                        .subscribe((msg => console.log(msg)));
                    const response: IReponse<HouseEntity> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                    };
                    res.json(response);
                }, (err) => {
                    const response: IReponse<HouseEntity> = {
                        statusCode: Code.ERROR,
                        message: err.message,
                    };
                    res.json(response);
                },
            );
    }
}
