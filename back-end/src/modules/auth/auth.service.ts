import { Injectable, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { DatabaseHelper } from '../../helpers/database.helper';
import { UserEntity } from './../../database/user.entity';
import { map, mergeAll, mergeMap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { v4 as uuid } from 'uuid';
import { LoginDTO } from './dto/login.dto';
import { Role } from '../../constants/role.enum';
import { NotificationContant } from './../../constants/notification.constant';
import * as jwt from 'jsonwebtoken';
import { LoginRO } from './ro/login.ro';
import { of } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
    private databaseHelper: DatabaseHelper<UserEntity, UserDTO>;
    onModuleInit() {
        this.databaseHelper = new DatabaseHelper<UserEntity, UserDTO>(UserEntity);
    }
    register(data: UserDTO) {
        const { email } = data;
        return this.databaseHelper.findOne('email', email).pipe(
            map((value: UserEntity) => {
                if (!value) {
                    data.code = uuid();
                    return this.databaseHelper.insert(data);
                } else {
                    return throwError(new Error('Email already exist'));
                }
            }),
            mergeAll()
        );
    }

    activeUser(id: string, code: string) {
        return this.databaseHelper.findOne('id', id).pipe(
            map((value: UserEntity) => {
                if (!value) {
                    return throwError(new Error('ID is not match with any user'));
                } else if (value.code === code) {
                    value.code = '';
                    value.active = true;
                    return this.databaseHelper.update(id, value)
                } else {
                    return throwError(new Error('Activation code is not valid'));
                }
            }),
            mergeAll(),
        );
    }

    login(data: LoginDTO) {
        const { email, password, type } = data;
        return this.databaseHelper.findOne('email', email).pipe(
            mergeMap(async (value: UserEntity) => {
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
