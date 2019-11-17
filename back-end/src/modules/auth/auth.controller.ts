import { Controller, Post, Body, UsePipes, Res, Get, Param } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from './../../shared/pipes/validation.pipe';
import { UserEntity } from '../../database/user.entity';
import { IReponse } from '../../shared/interface/ireponse.interface';
import { Response } from 'express';
import { Code } from '../../constants/code.enum';
import { LoginDTO } from './dto/login.dto';
import { LoginRO } from './ro/login.ro';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }
    @Post('/login')
    login(@Res() res: Response, @Body() data: LoginDTO) {
        this.authService.login(data)
            .subscribe(
                (value: LoginRO) => {
                    const response: IReponse<LoginRO> = {
                        statusCode: Code.SUCCESS,
                        message: 'Thành công',
                        data: value,
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

    @Post('/register')
    @UsePipes(new ValidationPipe())
    register(@Res() res: Response, @Body() data: UserDTO) {

        this.authService.register(data)
            .subscribe(
                () => {
                    const response: IReponse<UserEntity> = {
                        statusCode: Code.SUCCESS,
                        message: 'Thành công',
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

    @Get('/active/:id/:code')
    activeCode(@Res() res: Response, @Param('id') id: string, @Param('code') code: string) {

        this.authService.activeUser(id, code)
            .subscribe(
                () => {
                    const response: IReponse<UserEntity> = {
                        statusCode: Code.SUCCESS,
                        message: 'Thành công',
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

}
