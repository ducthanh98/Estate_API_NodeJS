import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { AmentitiesEntity } from './amentities.entity';
import { CommentEntity } from './comment.entity';
import { GalleryEntity } from './gallery.entity';
import { PostEntity } from './post.entity';
import { PostTypeEntity } from './postType.entity';
import { ReportEntity } from './report.entity';
import { ReportTypeEntity } from './reportType.entity';

export const DatabaseEntitities = [
    UserEntity,
    AmentitiesEntity,
    CommentEntity,
    GalleryEntity,
    PostEntity,
    PostTypeEntity,
    ReportEntity,
    ReportTypeEntity];
