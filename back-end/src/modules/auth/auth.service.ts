import { Injectable, OnModuleInit, HttpException, HttpStatus, Logger, UseGuards, Post } from '@nestjs/common';
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
import { AuthGuard } from './../../shared/guards/auth.guard';
import { PasswordDTO } from './dto/password.dto';
import * as bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../../constants/variable.constant';
@Injectable()
export class AuthService implements OnModuleInit {
    private databaseHelper: DatabaseHelper<UserEntity, UserDTO>;
    private nodeMailer: NodeMailer;
    onModuleInit() {
        this.databaseHelper = new DatabaseHelper<UserEntity, UserDTO>(UserEntity);
        this.nodeMailer = new NodeMailer();
    }
    register(data: UserDTO, protocol: string, host: string) {
        const { email } = data;
        return this.databaseHelper.findOne('email', email).pipe(
            switchMap((value: UserEntity) => {
                if (!value) {
                    data.code = uuid();
                    return this.databaseHelper.insert(data);
                } else {
                    const verifyUrl = `${protocol}://localhost:4200/auth/verify/${value.id}/${value.code}`;
                    this.nodeMailer.sendMail(value.email, MailTemplate.SUBJECT, verifyUrl).subscribe();
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
                    const verifyUrl = `${protocol}://localhost:4200/auth/verify/${value.id}/${value.code}`;
                    return this.nodeMailer.sendMail(value.email, MailTemplate.SUBJECT, verifyUrl);
                }
            }),
        );
    }

    login(data: LoginDTO, protocol: string, host: string) {
        const { email, password, type } = data;
        return this.databaseHelper.findOne('email', email).pipe(
            switchMap(async (value: UserEntity) => {
                if (!value) {
                    return throwError(new Error(NotificationContant.EMAIL_NOT_EXIST));
                } else if (!(await value.comparePassword(password))) {
                    return throwError(new Error(NotificationContant.PASS_INCORRECT));
                } else if (!value.active) {
                    const verifyUrl = `${protocol}://localhost:4200/auth/verify/${value.id}/${value.code}`;
                    this.nodeMailer.sendMail(value.email, MailTemplate.SUBJECT, verifyUrl).subscribe();
                    return throwError(new Error(NotificationContant.ACC_NOT_ACTIVE));
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
    updateUserInfo(data: Partial<UserDTO>, id: number) {
        this.databaseHelper.repository.create()
        return this.databaseHelper.update(id, data);
    }

    updatePassword(id: number, passwordDTO: PasswordDTO) {
        return this.databaseHelper.findOne('id', id).pipe(
            switchMap(async (value: UserEntity) => {
                if (!value) {
                    return throwError(new Error(NotificationContant.ID_NOT_MATCH));
                } else if (!(await value.comparePassword(passwordDTO.oldPass))) {
                    return throwError(new Error(NotificationContant.PASS_INCORRECT));
                } else {
                    const password = await this.hashPassword(passwordDTO.password);
                    return this.databaseHelper.update(id, { password });
                }
            }),
            mergeAll(),
        );
    }

    async hashPassword(password) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return await bcrypt.hash(password, salt);
    }
}
