import { Repository, DeleteResult, UpdateResult, DeepPartial, getRepository } from 'typeorm';
import { from, Observable, of, pipe } from 'rxjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { map, switchMap, skip, take } from 'rxjs/operators';
import { NotificationContant } from './../constants/notification.constant';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Ilist } from '../shared/interface/IList.interface';
import { IDatabase } from './../database/dao/IDatabase.dao';

export class DatabaseHelper<Entity, DTO> implements IDatabase<Entity, DTO> {
    private repository: Repository<Entity>;
    constructor(TCtor: new (...args: any[]) => Entity) {
        this.repository = getRepository(TCtor);
    }
    get getRepository() {
        return this.repository;
    }

    findAll(relations = [], takeNumber = null, orderOption?, condition = {}): Observable<Entity[]> {
        return from(this.repository.find({
            where : condition,
            order: orderOption,
            relations,
            take: takeNumber,
        }));
    }

    findAllBy(pageNumber = 1, pageSize = 10, condition = {}, relations = [], orderOption = {}): Observable<Ilist<Entity>> {
        return from(this.repository.findAndCount(
            {
                where: condition,
                skip: (pageNumber - 1) * 10,
                take: pageSize,
                relations,
                order: orderOption,
            },
        )).pipe(
            map(
                (data: any) => {
                    const response: Ilist<Entity> = {
                        list: data[0],
                        total: data[1],
                    };
                    return response;
                },
            ),
        );
    }

    findOne(key: string, value: string | number, relations = []): Observable<Entity> {
        let condition = `{"${key}":"${value}"}`;
        condition = JSON.parse(condition);
        return from(this.repository.findOne({ where: condition, relations }));
    }

    insert(data: DTO): Observable<Entity>;
    insert(data: DTO[]): Observable<Entity[]>;
    insert(data: any): any {
        const entity: Entity | Entity[] = this.repository.create(data);
        return from(this.repository.save(entity));
    }
    update(id: number, data: QueryDeepPartialEntity<Entity>): Observable<string> {
        return from(this.repository.update(id, data)).pipe(
            switchMap((value: UpdateResult) => {
                if (value.raw.affectedRows > 0) {
                    return of(NotificationContant.UPDATE_SUCCESS);
                } else {
                    return throwError(new Error(NotificationContant.ID_NOT_MATCH));
                }
            }),
        );
    }

    delete(id: number): Observable<string> {
        return from(this.repository.delete(id)).pipe(
            switchMap((value: DeleteResult) => {
                if (value.affected > 0) {
                    return of(NotificationContant.DELETE_SUCCESS);
                } else {
                    return throwError(new Error(NotificationContant.ID_NOT_MATCH));
                }
            }),
        );
    }
}
