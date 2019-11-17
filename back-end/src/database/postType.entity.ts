import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('post_type')
export class PostTypeEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { length: 100 })
    name: string;

    @OneToMany(type => PostEntity, post => post.postType)
    posts: PostEntity[];
}