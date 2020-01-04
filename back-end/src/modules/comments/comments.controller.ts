import { Controller, UseGuards, Post, UsePipes, ValidationPipe, Res, Body, Param, Get, Req } from '@nestjs/common';
import { AuthGuard } from './../../shared/guards/auth.guard';
import { CommentsService } from './comments.service';
import { BodyDTO } from './../../shared/class/body.dto';
import { Ilist } from './../../shared/interface/IList.interface';
import { IReponse } from './../../shared/interface/ireponse.interface';
import { Code } from '../../constants/code.enum';
import { NotificationContant } from '../../constants/notification.constant';
import { ReportTypeDTO } from '../admin/reportType/reportType.dto';
import { CommentDTO } from './dto/comment.dto';
import { CommentEntity } from './../../database/entities/comment.entity';
import { Response, Request } from 'express';
import { CommentRO } from './ro/comment.ro';
import { UpdateCommentDTO } from './dto/UpdateComment.dto';

@Controller('comments')
export class CommentsController {
    constructor(private commentService: CommentsService) { }

    @Post('getAllBy/:id')
    @UsePipes(new ValidationPipe())
    getAllBy(@Res() res: Response, @Body() data: BodyDTO, @Param('id') id: number) {
        return this.commentService.getAllBy(data.pageNumber, data.pageSize, id)
            .subscribe(
                (comments: Ilist<CommentRO>) => {
                    const response: IReponse<Ilist<CommentRO>> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: comments,
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
    update(@Res() res: Response, @Req() req, @Param('id') id: number, @Body() data: UpdateCommentDTO) {
        return this.commentService.update(id, data, req.user)
            .subscribe(
                (message: string) => {
                    const response: IReponse<any> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
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
    create(@Res() res: Response, @Req() req, @Body() data: CommentDTO) {
        return this.commentService.create(data, req.user.id)
            .subscribe(
                (comment: CommentRO) => {
                    const response: IReponse<any> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: comment,
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

    // @Post('update/:id')
    // @UsePipes(new ValidationPipe())
    // update(@Res() res: Response, @Body() data: ReportTypeDTO, @Param('id') id: number) {
    //     return this.commentService.update(id, data)
    //         .subscribe(
    //             (message: string) => {
    //                 const response: IReponse<any> = {
    //                     statusCode: Code.SUCCESS,
    //                     message,
    //                 };
    //                 res.json(response);
    //             }, (err) => {
    //                 const response: IReponse<any> = {
    //                     statusCode: Code.ERROR,
    //                     message: err.message,
    //                 };
    //                 res.json(response);
    //             },
    //         );
    // }

    // @Get('delete/:id')
    // delete(@Res() res: Response, @Param('id') id: number) {
    //     return this.commentService.delete(id)
    //         .subscribe(
    //             (message: string) => {
    //                 const response: IReponse<any> = {
    //                     statusCode: Code.SUCCESS,
    //                     message,
    //                 };
    //                 res.json(response);
    //             }, (err) => {
    //                 const response: IReponse<any> = {
    //                     statusCode: Code.ERROR,
    //                     message: err.message,
    //                 };
    //                 res.json(response);
    //             },
    //         );
    // }
}
