import { PrimaryGeneratedColumn, Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { HouseEntity } from './house.entity';
@Entity('amentities')
export class AmentitiesEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { length: 50 })
    name: string;

    @Column('nvarchar', { length: 20 })
    icon: string;

    @ManyToMany(type => HouseEntity, house => house.amentities)
    house: HouseEntity[];
}
