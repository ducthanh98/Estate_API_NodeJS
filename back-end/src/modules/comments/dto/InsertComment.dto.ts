import { HouseEntity } from './../../../database/entities/house.entity';
import { UserEntity } from './../../../database/entities/user.entity';

export class InsertCommentDTO {
    comment: string;
    post: HouseEntity;
    user: UserEntity;
}
