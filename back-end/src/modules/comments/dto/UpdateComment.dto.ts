import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCommentDTO {
    @IsString()
    @IsNotEmpty()
    comment: string;
}
