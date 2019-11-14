import { getRepository, Repository, DeleteResult, UpdateResult } from 'typeorm';
import { from, Observable } from 'rxjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { map } from 'rxjs/operators';
import { NotificationContant } from './../constants/notification.constant';

export class DatabaseHelper<Entity, DTO> {
    private repository: Repository<Entity>;
    constructor(TCtor: new (...args: any[]) => Entity) {
        this.repository = getRepository(TCtor);
    }

    findAll(): Observable<Entity[]> {
        return from(this.repository.find());
    }
    findOne(id: string | number) {
        return from(this.repository.findOne({ where: { id } }));
    }

    insert(data: DTO): Observable<Entity> {
        const entity: Entity = this.repository.create(data);
        return from(this.repository.save(entity));
    }
    update(id: string, data: QueryDeepPartialEntity<Entity>) {
        return from(this.repository.update(id, data)).pipe(
            map((value: UpdateResult) => {
                if (value.raw.affectedRows > 0) {
                    return NotificationContant.UPDATE_SUCCESS;
                } else {
                    return NotificationContant.DELETE_FAILED;
                }
            }),
        );
    }

    delete(id: string): Observable<string> {
        return from(this.repository.delete(id)).pipe(
            map((value: DeleteResult) => {
                if (value.affected > 0) {
                    return NotificationContant.DELETE_SUCCESS;
                } else {
                    return NotificationContant.DELETE_FAILED;
                }
            }),
        );
    }
}
