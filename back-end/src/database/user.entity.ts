import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../constants/variable.constant';
import { PostEntity } from './post.entity';
import { Role } from '../constants/role.enum';
import { UserRO } from './../modules/auth/ro/user.ro';
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

    @Column('boolean', { default: false })
    active: boolean;

    @Column('boolean')
    gender: boolean;

    @Column('varchar', { length: 50, nullable: true })
    code: string;

    @OneToMany(type => PostEntity, post => post.author)
    posts: PostEntity[];

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        this.password = await bcrypt.hash(this.password, salt);
    }

    comparePassword(attempt: string) {
        return bcrypt.compare(attempt, this.password);
    }
    toResponseObject(): UserRO {
        const { id, name, email, phone, facebook, skype, role } = this;
        const response: UserRO = {
            id, name, email, phone, facebook, skype, role,
        };
        return response;
    }
}
