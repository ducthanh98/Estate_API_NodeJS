import { PrimaryGeneratedColumn, Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { PostEntity } from './post.entity';
@Entity('amentities')
export class AmentitiesEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { length: 50 })
    name: string;

    @ManyToMany(type => PostEntity, post => post.amentities)
    posts: PostEntity[];
}