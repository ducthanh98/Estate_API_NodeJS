import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDTO {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
    password: string;

    phone: string;

    facebook: string;

    skype: string;

    role: number;

    code: string;
}
