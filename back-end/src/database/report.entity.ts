import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ReportTypeEntity } from './reportType.entity';
import { PostEntity } from './post.entity';
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

    @OneToOne(type => PostEntity)
    @JoinColumn()
    post: PostEntity;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    author: UserEntity;
}
