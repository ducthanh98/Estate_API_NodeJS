import { Injectable, OnModuleInit, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { DatabaseHelper } from '../../helpers/database.helper';
import { UserEntity } from './../../database/user.entity';
import { mergeAll, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { v4 as uuid } from 'uuid';
import { LoginDTO } from './dto/login.dto';
import { Role } from '../../constants/role.enum';
import { NotificationContant } from './../../constants/notification.constant';
import * as jwt from 'jsonwebtoken';
import { LoginRO } from './ro/login.ro';
import { of } from 'rxjs';
import { MailTemplate } from './../../constants/mail.constant';
import { NodeMailer } from './../../helpers/nodemailer.helper';

@Injectable()
export class AuthService implements OnModuleInit {
    private databaseHelper: DatabaseHelper<UserEntity, UserDTO>;
    private nodeMailer: NodeMailer;
    onModuleInit() {
        this.databaseHelper = new DatabaseHelper<UserEntity, UserDTO>(UserEntity);
        this.nodeMailer = new NodeMailer();
    }
    register(data: UserDTO) {
        const { email } = data;
        return this.databaseHelper.findOne('email', email).pipe(
            switchMap((value: UserEntity) => {
                if (!value) {
                    data.code = uuid();
                    return this.databaseHelper.insert(data);
                } else {
                    return throwError(new Error('Email already exist'));
                }
            }),
        );
    }

    activeUser(id: number, code: string) {
        return this.databaseHelper.findOne('id', id).pipe(
            switchMap((value: UserEntity) => {
                if (!value) {
                    return throwError(new Error(NotificationContant.ID_NOT_MATCH));
                } else if (value.code === code) {
                    value.code = '';
                    value.active = true;
                    return this.databaseHelper.update(id, value);
                } else {
                    return throwError(new Error(NotificationContant.CODE_INVALID));
                }
            }),
        );
    }

    sendActiveMail(id: number, protocol: string, host: string) {
        return this.databaseHelper.findOne('id', id).pipe(
            switchMap((value: UserEntity) => {
                if (!value) {
                    return throwError(new Error('ID is not match with any user'));
                } else if (value.code === '') {
                    return throwError(new Error(MailTemplate.EMAIL_SERVER_ERR));
                } else if (value.active) {
                    return throwError(new Error(NotificationContant.USER_ACTIVATED));
                } else {
                    const verifyUrl = `${protocol}://${host}/verify/${value.code}`;
                    return this.nodeMailer.sendMail(value.email, MailTemplate.SUBJECT, verifyUrl);
                }
            }),
        );
    }

    login(data: LoginDTO) {
        const { email, password, type } = data;
        return this.databaseHelper.findOne('email', email).pipe(
            switchMap(async (value: UserEntity) => {
                if (!value) {
                    return throwError(new Error(NotificationContant.EMAIL_NOT_EXIST));
                } else if (!value.active) {
                    return throwError(new Error(NotificationContant.ACC_NOT_ACTIVE));
                } else if (!(await value.comparePassword(password))) {
                    return throwError(new Error(NotificationContant.PASS_INCORRECT));
                } else if (type && value.role > Role.SUBADMIN) {
                    return throwError(new Error(NotificationContant.NOT_PERMISSION));
                } else {
                    const response: LoginRO = {
                        access_token: this.generateToken(value.id, value.email, value.role),
                        user_info: value.toResponseObject(),
                    };
                    return of(response);
                }
            }),
            mergeAll(),
        );
    }

    private generateToken(id: number, email: string, role: number) {
        return jwt.sign({ id, email, role }, process.env.SECRET, { expiresIn: '1d' });
    }
}
