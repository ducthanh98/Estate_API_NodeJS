import { UserRO } from './user.ro';

export interface LoginRO {
    access_token: string;
    user_info: UserRO;
}