import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntitities } from '../database/database.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature(DatabaseEntitities),
        AdminModule,
    ],
    exports: [AuthModule],
})

export class ModulesModule { }
