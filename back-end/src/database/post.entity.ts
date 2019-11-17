import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { PostTypeEntity } from './postType.entity';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { GalleryEntity } from './gallery.entity';
import { AmentitiesEntity } from './amentities.entity';

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { length: 50 })
    title: string;

    @Column('varchar', { length: 50 })
    location: string;

    @Column('tinyint')
    bedrooms: number;

    @Column('tinyint')
    bathrooms: number;

    @Column('int')
    area: number;

    @Column('double')
    price: number;

    @Column('text')
    description: string;

    @ManyToOne(type => UserEntity, user => user.posts)
    author: UserEntity;

    @ManyToOne(type => PostTypeEntity, types => types.posts)
    postType: PostTypeEntity;

    @OneToMany(type => CommentEntity, comment => comment.post)
    comments: CommentEntity[];

    @OneToMany(type => GalleryEntity, gallery => gallery.post)
    images: GalleryEntity[];

    @ManyToMany(type => AmentitiesEntity, amentities => amentities.posts)
    @JoinTable()
    amentities: AmentitiesEntity[];
}
