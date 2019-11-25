import { getRepository, Repository, DeleteResult, UpdateResult } from 'typeorm';
import { from, Observable, of, pipe } from 'rxjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { map, switchMap, skip, take } from 'rxjs/operators';
import { NotificationContant } from './../constants/notification.constant';
import { throwError } from 'rxjs/internal/observable/throwError';
import { AmentitiesRO } from './../modules/admin/amentities/amentities.ro';
import { Ilist } from '../shared/interface/IList.interface';

export class DatabaseHelper<Entity, DTO> {
    public repository: Repository<Entity>;
    constructor(TCtor: new (...args: any[]) => Entity) {
        this.repository = getRepository(TCtor);
    }

    findAll(): Observable<Entity[]> {
        return from(this.repository.find());
    }

    findAllBy(pageNumber = 1, pageSize = 10, condition = {}) {
        return from(this.repository.findAndCount(
            {
                where: condition,
                skip: (pageNumber - 1) * 10,
                take: pageSize,
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

    findOne(key: string, value: string | number) {
        let condition = `{"${key}":"${value}"}`;
        condition = JSON.parse(condition);
        return from(this.repository.findOne({ where: condition }));
    }

    insert(data: DTO): Observable<Entity> {
        const entity: Entity = this.repository.create(data);
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
