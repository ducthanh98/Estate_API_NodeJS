import { IsNotEmpty, IsEmail, MinLength, MaxLength, IsString } from 'class-validator';

export class AmentitiesDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    icon: string;
}
