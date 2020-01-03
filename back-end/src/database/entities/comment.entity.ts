import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { HouseEntity } from './house.entity';
import { UserEntity } from '../../database/entities/user.entity';

@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar')
    comment: string;

    @ManyToOne(type => HouseEntity, post => post.comments)
    post: HouseEntity;

    @ManyToOne(type => UserEntity, user => user.comments)
    user: UserEntity;
}
