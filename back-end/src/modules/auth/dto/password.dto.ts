import { IsString, MinLength, MaxLength } from "class-validator";

export class PasswordDTO {
    @IsString()
    @MinLength(8)
    @MaxLength(16)
    oldPass: string;
    @IsString()
    @MinLength(8)
    @MaxLength(16)
    password: string;
}
