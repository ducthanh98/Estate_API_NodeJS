import { UserRO } from './../../auth/ro/user.ro';
import { GalleryEntity } from '../../../database/gallery.entity';
import { CommentEntity } from '../../../database/comment.entity';
import { PostTypeEntity } from '../../../database/postType.entity';
import { AmentitiesEntity } from '../../../database/amentities.entity';

export class PostRO {
    id: number;
    title: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    price: number;
    description: string;
    author: UserRO;
    postType: PostTypeEntity;
    comments: CommentEntity[];
    images: GalleryEntity[];
    amentities: AmentitiesEntity[];
}
