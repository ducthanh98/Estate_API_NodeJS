import { Injectable } from '@nestjs/common';
import { DatabaseHelper } from 'src/helpers/database.helper';
import { UserEntity } from 'src/database/entities/user.entity';
import { UserDTO } from '../auth/dto/user.dto';
import { NodeMailer } from 'src/helpers/nodemailer.helper';
import { switchMap } from 'rxjs/operators';
import uuid = require('uuid');
import { MailTemplate } from 'src/constants/mail.constant';
import { throwError, merge } from 'rxjs';
import { NotificationContant } from './../../constants/notification.constant';

@Injectable()
export class ObserveService {
    private databaseHelper: DatabaseHelper<UserEntity, UserDTO>;
    onModuleInit() {
        this.databaseHelper = new DatabaseHelper<UserEntity, UserDTO>(UserEntity);
    }

    subcribeEmail(email, protocol: string, host: string) {
        return this.databaseHelper.findOne('email', email).pipe(
            switchMap((value: UserEntity) => {
                if (value && value.subcribe) {
                    return throwError(new Error(NotificationContant.USER_IN_SUBCRIBE_LIST));
                } else if (value) {
                    value.subcribe = true;
                    return this.databaseHelper.update(value.id, value);
                } else {
                    return throwError(new Error(NotificationContant.EMAIL_NOT_EXIST));
                }
            }),
        );
    }

}
