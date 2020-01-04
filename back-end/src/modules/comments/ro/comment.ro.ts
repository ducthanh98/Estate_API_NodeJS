import { UserRO } from './../../auth/ro/user.ro';

export class CommentRO {
    id: number;
    comment: string;
    user: UserRO;
}
