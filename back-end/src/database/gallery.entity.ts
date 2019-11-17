import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('gallery')
export class GalleryEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { length: 50 })
    imgName: string;

    @ManyToOne(type => PostEntity, post => post.images)
    post: PostEntity;
}
