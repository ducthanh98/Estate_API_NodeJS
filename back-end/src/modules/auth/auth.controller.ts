import { Controller, Post, Body, UsePipes, Res, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from './../../shared/pipes/validation.pipe';
import { UserEntity } from '../../database/entities/user.entity';
import { IReponse } from '../../shared/interface/ireponse.interface';
import { Response, Request } from 'express';
import { Code } from '../../constants/code.enum';
import { LoginDTO } from './dto/login.dto';
import { LoginRO } from './ro/login.ro';
import { ActiveDTO } from './dto/active.dto';
import { NotificationContant } from './../../constants/notification.constant';
import { PasswordDTO } from './dto/password.dto';
import { AuthGuard } from './../../shared/guards/auth.guard';
import { BodyDTO } from './../../shared/class/body.dto';
import { Ilist } from './../../shared/interface/IList.interface';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }
    @Post('/login')
    login(@Req() req: Request, @Res() res: Response, @Body() data: LoginDTO) {
        this.authService.login(data, req.protocol, req.get('host'))
            .subscribe(
                (value: LoginRO) => {
                    const response: IReponse<LoginRO> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.SUCCESS,
                        data: value,
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

    @Post('/register')
    @UsePipes(new ValidationPipe())
    register(@Req() req: Request, @Res() res: Response, @Body() data: UserDTO) {

        this.authService.register(data, req.protocol, req.get('host'))
            .subscribe(
                () => {
                    const response: IReponse<UserEntity> = {
                        statusCode: Code.SUCCESS,
                        message: NotificationContant.ACTIVE_EMAIL,
                    };
                    res.json(response);
                }, (err) => {
                    const response: IReponse<UserEntity> = {
                        statusCode: Code.ERROR,
                        message: err.message,
                    };
                    res.json(response);
                },
            );

    }
    @Post('/create')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    createUser(@Req() req: Request, @Res() res: Response, @Body() data: UserDTO) {

        this.authService.createUser(data)
            .subscribe(
                () => {
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
    @Post('/update/:id')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    updateUser(@Req() req: Request, @Res() res: Response, @Param('id') id: number, @Body() data: UpdateUserDTO) {

        this.authService.updateUser(id, data)
            .subscribe(
                () => {
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

    @Get('/verify/:id/:code')
    activeCode(@Res() res: Response, @Param('id') id: number, @Param('code') code: string) {

        this.authService.activeUser(id, code)
            .subscribe(
                () => {
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

    @Post('send-mail')
    @UsePipes(new ValidationPipe())
    sendMail(@Req() req: Request, @Res() res: Response, @Body() data: ActiveDTO) {
        return this.authService.sendActiveMail(data.id, req.protocol, req.get('host'))
            .subscribe(
                () => {
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

    @Post('updateInfo/:id')
    updateUserInfo(@Res() res: Response, @Body() data: UserDTO, @Param('id') id: number) {
        return this.authService.updateUserInfo(data, id)
            .subscribe(
                () => {
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

    @Post('updatePassword/:id')
    updatePassword(@Res() res: Response, @Body() data: PasswordDTO, @Param('id') id: number) {
        return this.authService.updatePassword(id, data)
            .subscribe(
                () => {
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

    @Post('getAllBy')
    @UsePipes(new ValidationPipe())
    getAllBy(@Res() res: Response, @Body() data: BodyDTO) {
        return this.authService.getAllBy(data.pageNumber, data.pageSize)
            .subscribe(
                (comments: Ilist<UserEntity>) => {
                    const response: IReponse<Ilist<UserEntity>> = {
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
}
