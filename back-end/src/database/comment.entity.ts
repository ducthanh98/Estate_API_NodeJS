import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar')
    comment: string;

    @ManyToOne(type => PostEntity, post => post.comments)
    post: PostEntity;
}
