import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntitities } from '../database/database.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature(DatabaseEntitities),
    ],
    exports: [AuthModule],
})

export class ModulesModule { }
