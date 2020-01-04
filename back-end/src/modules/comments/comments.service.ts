import { Injectable } from '@nestjs/common';
import { CommentEntity } from '../../database/entities/comment.entity';
import { CommentDTO } from './dto/comment.dto';
import { DatabaseHelper } from '../../helpers/database.helper';
import { throwIfEmpty, switchMap, map, tap } from 'rxjs/operators';
import { PostDTO } from '../rent-hostel/dto/post.dto';
import { HouseEntity } from '../../database/entities/house.entity';
import { UserEntity } from './../../database/entities/user.entity';
import { UserDTO } from '../auth/dto/user.dto';
import { NotificationContant } from '../../constants/notification.constant';
import { InsertCommentDTO } from './dto/InsertComment.dto';
import { zip, of } from 'rxjs';
import { CommentRO } from './ro/comment.ro';
import { throwError } from 'rxjs/internal/observable/throwError';
import { UpdateCommentDTO } from './dto/UpdateComment.dto';
import { Role } from './../../constants/role.enum';
import { Ilist } from './../../shared/interface/IList.interface';

@Injectable()
export class CommentsService {
    private commentHelper: DatabaseHelper<CommentEntity, InsertCommentDTO>;
    private postHelper: DatabaseHelper<HouseEntity, PostDTO>;
    private userHelper: DatabaseHelper<UserEntity, UserDTO>;
    onModuleInit() {
        this.commentHelper = new DatabaseHelper<CommentEntity, InsertCommentDTO>(CommentEntity);
        this.postHelper = new DatabaseHelper<HouseEntity, PostDTO>(HouseEntity);
        this.userHelper = new DatabaseHelper<UserEntity, UserDTO>(UserEntity);
    }
    getAllBy(pageNumber = 1, pageSize = 10, id: number) {
        const condition = [
            { post: { id } },
        ];
        return this.commentHelper.findAllBy(pageNumber, pageSize, condition, ['user', 'post'])
            .pipe(
                map((value: Ilist<CommentEntity>) => {
                    const list: CommentRO[] = value.list.map((tmp: CommentEntity) => {
                        return { id: tmp.id, comment: tmp.comment, user: tmp.user.toResponseObject() };
                    });
                    const resp: Ilist<CommentRO> = {
                        total: value.total,
                        list,
                    };
                    return resp;
                }),
            );
    }
    create(commentDTO: CommentDTO, uid: number) {
        return zip(this.checkValidPost(commentDTO.postId), this.checkValidUser(uid))
            .pipe(
                switchMap((value: [HouseEntity, UserEntity]) => {
                    const dataToInsert: InsertCommentDTO = {
                        comment: commentDTO.comment,
                        post: value[0],
                        user: value[1],
                    };
                    return this.commentHelper.insert(dataToInsert);
                }),
                map((comment: CommentEntity) => {
                    const commentRO: CommentRO = {
                        ...comment,
                        user: comment.user.toResponseObject(),
                    };
                    return commentRO;
                }),
            );
    }

    update(id: number, comment: UpdateCommentDTO, user) {
        return this.commentHelper.findOne('id', id, ['user'])
            .pipe(
                switchMap((value: CommentEntity) => {
                    if (!value) { return throwError(new Error(NotificationContant.ID_NOT_MATCH)); }
                    if ((value.user.id !== user.id) && user.role > Role.SUBADMIN) {
                        return throwError(new Error(NotificationContant.NOT_PERMISSION));
                    }
                    return this.commentHelper.update(id, comment);
                }),
            );
    }

    private checkValidPost(postId: number) {
        return this.postHelper.findOne('id', postId)
            .pipe(
                switchMap((value: HouseEntity) => {
                    if (!value) { return throwError(new Error(NotificationContant.INVALID_POST)); }
                    return of(value);
                }),
            );
    }
    private checkValidUser(uid: number) {
        return this.userHelper.findOne('id', uid)
            .pipe(
                switchMap((value: UserEntity) => {
                    if (!value) { return throwError(NotificationContant.INVALID_USER); }
                    return of(value);
                }),
            );
    }

}
