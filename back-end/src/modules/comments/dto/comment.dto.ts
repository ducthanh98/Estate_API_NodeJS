import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CommentDTO {
    @IsString()
    @IsNotEmpty()
    comment: string;
    @IsNumber()
    postId: number;
}
