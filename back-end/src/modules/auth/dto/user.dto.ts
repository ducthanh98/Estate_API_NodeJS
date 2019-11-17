import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class UserDTO {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    password: string;

    phone: string;

    facebook: string;

    skype: string;

    role: number;

    code: string;
}
