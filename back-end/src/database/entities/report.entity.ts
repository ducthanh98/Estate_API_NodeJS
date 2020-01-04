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

    @Column('tinyint', { default: 0 })
    status: number; // 0 chua xu li | 1 bao cao vi pham chinh xac | 2 bao cao sai

    @ManyToOne(type => ReportTypeEntity, reportType => reportType.reports)
    @JoinColumn()
    reportType: ReportTypeEntity;

    @ManyToOne(house => HouseEntity, house => house.reports)
    @JoinColumn()
    post: HouseEntity;

    @ManyToOne(type => UserEntity, user => user.reports)
    @JoinColumn()
    author: UserEntity;
}
