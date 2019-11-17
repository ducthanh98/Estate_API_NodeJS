import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from 'typeorm';
import { ReportEntity } from './report.entity';

@Entity('report_type')
export class ReportTypeEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar')
    reportContent: string;

}
