import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { GalleryEntity } from './gallery.entity';
import { AmentitiesEntity } from './amentities.entity';
import { ReportEntity } from './report.entity';

@Entity('house')
export class HouseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar')
    title: string;

    @Column('varchar')
    location: string;

    @Column('tinyint')
    lat: number;

    @Column('tinyint')
    lng: number;

    @Column('tinyint')
    bedrooms: number;

    @Column('tinyint')
    bathrooms: number;

    @Column('boolean', { default: false })
    status: boolean;

    @Column('int')
    area: number;

    @Column('double')
    price: number;

    @Column('text')
    description: string;

    @CreateDateColumn() created: Date;

    @ManyToOne(type => UserEntity, user => user.posts)
    author: UserEntity;

    @OneToMany(type => CommentEntity, comment => comment.post)
    comments: CommentEntity[];

    @OneToMany(type => GalleryEntity, gallery => gallery.post)
    images: GalleryEntity[];

    @OneToMany(type => ReportEntity, report => report.post)
    reports: ReportEntity[];

    @ManyToMany(type => AmentitiesEntity, amentities => amentities.house)
    @JoinTable()
    amentities: AmentitiesEntity[];
}
