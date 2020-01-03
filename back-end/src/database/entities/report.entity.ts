import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ReportTypeEntity } from './reportType.entity';
import { HouseEntity } from './house.entity';
import { UserEntity } from './user.entity';

@Entity('report')
export class ReportEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    created: Date;

    @Column('boolean')
    status: boolean;

    @OneToOne(type => ReportTypeEntity)
    @JoinColumn()
    reportType: ReportTypeEntity;

    @OneToOne(type => HouseEntity)
    @JoinColumn()
    post: HouseEntity;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    author: UserEntity;
}
