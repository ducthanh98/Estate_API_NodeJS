import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseEntitities } from '../database/database.module';
import { AdminModule } from './admin/admin.module';
import { RentHostelModule } from './rent-hostel/rent-hostel.module';
import { FilesModule } from './files/files.module';
import { CommentsModule } from './comments/comments.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature(DatabaseEntitities),
        AdminModule,
        RentHostelModule,
        FilesModule,
        CommentsModule,
    ],
    exports: [AuthModule],
})

export class ModulesModule { }
