import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
import { HouseEntity } from './house.entity';

@Entity('gallery')
export class GalleryEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { length: 50 })
    imgName: string;

    @ManyToOne(type => HouseEntity, post => post.images)
    post: HouseEntity;
}
