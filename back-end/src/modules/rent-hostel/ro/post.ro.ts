import { UserRO } from './../../auth/ro/user.ro';
import { GalleryEntity } from '../../../database/entities/gallery.entity';
import { CommentEntity } from '../../../database/entities/comment.entity';
import { AmentitiesEntity } from '../../../database/entities/amentities.entity';

export class PostRO {
    id: number;
    title: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    price: number;
    lat: number;
    lng: number;
    description: string;
    author: UserRO;
    comments: CommentEntity[];
    images: GalleryEntity[];
    amentities: AmentitiesEntity[];
}
