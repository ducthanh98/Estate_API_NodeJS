import { Injectable } from '@nestjs/common';
import { DatabaseHelper } from '../../helpers/database.helper';
import { HouseEntity } from '../../database/entities/house.entity';
import { RentHostelDTO } from './dto/rent-hostel.dto';
import { Like } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UserDTO } from '../auth/dto/user.dto';
import { switchMap, mergeMap, mergeAll } from 'rxjs/operators';
import { of, from, forkJoin } from 'rxjs';
import { GalleryEntity } from '../../database/entities/gallery.entity';
import { GalleryDTO } from './dto/gallery.dto';
import { PostDTO } from './dto/post.dto';
import { AmentitiesEntity } from '../../database/entities/amentities.entity';
import { AmentitiesDTO } from './../admin/amentities/amentities.dto';

@Injectable()
export class RentHostelService {
    private databaseHelper: DatabaseHelper<HouseEntity, PostDTO>;
    private userHelper: DatabaseHelper<UserEntity, UserDTO>;
    private galleryHelper: DatabaseHelper<GalleryEntity, GalleryDTO>;
    private amentitiesHelper: DatabaseHelper<AmentitiesEntity, AmentitiesDTO>;
    onModuleInit() {
        this.databaseHelper = new DatabaseHelper<HouseEntity, PostDTO>(HouseEntity);
        this.userHelper = new DatabaseHelper<UserEntity, UserDTO>(UserEntity);
        this.galleryHelper = new DatabaseHelper<GalleryEntity, GalleryDTO>(GalleryEntity);
        this.amentitiesHelper = new DatabaseHelper<AmentitiesEntity, AmentitiesDTO>(AmentitiesEntity);

    }

    getAllBy(pageNumber = 1, pageSize = 10, keyText = '') {
        const condition = [
            { title: Like(`%${keyText}%`) },
        ];
        const relations = ['images', 'author', 'amentities'];
        return this.databaseHelper.findAllBy(pageNumber, pageSize, condition, relations);
    }
    getNewest() {
        const relations = ['images', 'author'];
        return this.databaseHelper.findAll(relations, 6, { created: 'DESC'});
    }

    getById(id: number) {
        const relations = ['images', 'author', 'amentities'];
        return this.databaseHelper.findOne('id', id, relations);
    }

    private createPost(rentHostel: RentHostelDTO) {
        return this.userHelper.findOne('id', rentHostel.userId)
            .pipe(
                switchMap(async (user: UserEntity) => {

                    const post: PostDTO = {
                        title: rentHostel.title,
                        area: rentHostel.area,
                        author: user,
                        bathrooms: rentHostel.bathrooms,
                        bedrooms: rentHostel.bedrooms,
                        location: rentHostel.location,
                        price: rentHostel.price,
                        description: rentHostel.description,
                        lat: rentHostel.lat,
                        lng: rentHostel.lng,
                    };
                    return this.databaseHelper.insert(post);
                }),
                mergeAll(),
            );
    }

    createGallery(files: any[], rentHostel: RentHostelDTO) {
        return this.createPost(rentHostel)
            .pipe(
                switchMap((post: HouseEntity) => {
                    return forkJoin([
                        this.uploadFile(files, post),
                        this.insertAmentities(rentHostel.amentities, post)
                            .pipe(
                                switchMap((data: any) => {
                                    post.amentities = data;
                                    return this.databaseHelper.getRepository.save(post);
                                }),
                            ),
                    ]);
                }),
            );
    }

    update(id: number, rentHostel: RentHostelDTO) {
        // return this.databaseHelper.update(id, rentHostel);
    }

    delete(id: number) {
        return this.databaseHelper.delete(id);
    }

    private uploadFile(files: any[], post: HouseEntity) {
        const gallery = [];
        files.forEach((file) => {
            gallery.push({ imgName: file.filename, post });
        });
        return this.galleryHelper.insert(gallery);
    }
    private insertAmentities(amentities: string, post: HouseEntity) {
        const amentitiesList = [];
        const amentitiesSplit = amentities.split(',');
        amentitiesSplit.forEach((id) => {
            amentitiesList.push(this.amentitiesHelper.findOne('id', id));
        });
        return forkJoin(amentitiesList);
    }
}
