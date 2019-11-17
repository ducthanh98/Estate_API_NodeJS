import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    password: string;

    @IsNotEmpty()
    type: boolean;
}
