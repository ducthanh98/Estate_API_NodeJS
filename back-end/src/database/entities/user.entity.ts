import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../../constants/variable.constant';
import { HouseEntity } from './house.entity';
import { Role } from '../../constants/role.enum';
import { UserRO } from '../../modules/auth/ro/user.ro';
import { CommentEntity } from './comment.entity';
import { ReportEntity } from './report.entity';
@Entity('account')
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'nvarchar',
        length: 50,
    })
    name: string;
    @Column({
        type: 'varchar',
    })
    password: string;

    @Column('varchar', { unique: true })
    email: string;

    @Column('varchar', { default: 'avatar.jpg' })
    avatar: string;

    @Column({
        type: 'varchar',
        length: 16,
        nullable: true,
    })
    phone: string;

    @Column('varchar', { nullable: true })
    facebook: string;

    @Column('varchar', { nullable: true })
    skype: string;

    @Column('varchar', { length: 2, default: Role.USER })
    role: number;

    @Column('tinyint', { default: 0 })
    active: number; // 0 not active 1 active 2 block

    @Column('varchar', { length: 50, nullable: true })
    code: string;

    @OneToMany(type => HouseEntity, post => post.author)
    posts: HouseEntity[];

    @OneToMany(type => CommentEntity, comment => comment.user)
    comments: CommentEntity[];

    @OneToMany(type => ReportEntity, report => report.author)
    reports: ReportEntity[];

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        this.password = await bcrypt.hash(this.password, salt);
    }

    comparePassword(attempt: string) {
        return bcrypt.compare(attempt, this.password);
    }
    toResponseObject(): UserRO {
        const { id, name, email, phone, facebook, skype, role, avatar, active } = this;
        const response: UserRO = {
            id, name, email, phone, facebook, skype, role, avatar, active,
        };
        return response;
    }
}
