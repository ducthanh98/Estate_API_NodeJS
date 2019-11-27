import { Injectable } from '@nestjs/common';
import { DatabaseHelper } from 'src/helpers/database.helper';
import { PostEntity } from './../../database/post.entity';
import { RentHostelDTO } from './dto/rent-hostel.dto';
import { Like } from 'typeorm';
import { UserEntity } from 'src/database/user.entity';
import { UserDTO } from '../auth/dto/user.dto';
import { switchMap, mergeMap, mergeAll } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { GalleryEntity } from './../../database/gallery.entity';
import { GalleryDTO } from './dto/gallery.dto';

@Injectable()
export class RentHostelService {
    private databaseHelper: DatabaseHelper<PostEntity, RentHostelDTO>;
    private userHelper: DatabaseHelper<UserEntity, UserDTO>;
    private galleryHelper: DatabaseHelper<GalleryEntity, GalleryDTO>;
    onModuleInit() {
        this.databaseHelper = new DatabaseHelper<PostEntity, RentHostelDTO>(PostEntity);
        this.userHelper = new DatabaseHelper<UserEntity, UserDTO>(UserEntity);
        this.galleryHelper = new DatabaseHelper<GalleryEntity, GalleryDTO>(GalleryEntity);

    }

    getAllBy(pageNumber = 1, pageSize = 10, keyText = '') {
        const condition = [
            { title: Like(`%${keyText}%`) },
        ];
        const relations = ['images'];
        return this.databaseHelper.findAllBy(pageNumber, pageSize, condition, relations);
    }

    private createPost(rentHostel: RentHostelDTO) {
        return this.userHelper.findOne('id', rentHostel.userId)
            .pipe(
                switchMap(async (user: UserEntity) => {

                    const post = {
                        title: rentHostel.title,
                        area: rentHostel.area,
                        author: user,
                        bathrooms: rentHostel.bathrooms,
                        bedrooms: rentHostel.bedrooms,
                        location: rentHostel.location,
                        price: rentHostel.price,
                        description: rentHostel.description,

                    };
                    return this.databaseHelper.insert(post);
                }),
                mergeAll(),
            );
    }

    createGallery(files: any[], rentHostel: RentHostelDTO) {
        return this.createPost(rentHostel)
            .pipe(
                switchMap((post: PostEntity) => {
                    return this.uploadFile(files, post);
                })
            );
    }


    update(id: number, rentHostel: RentHostelDTO) {
        return this.databaseHelper.update(id, rentHostel);
    }

    delete(id: number) {
        return this.databaseHelper.delete(id);
    }

    private uploadFile(files: any[], post: PostEntity) {
        const gallery = [];
        files.forEach((file) => {
            gallery.push({ imgName: file.filename, post });
        });
        return this.galleryHelper.insert(gallery);
    }
}
