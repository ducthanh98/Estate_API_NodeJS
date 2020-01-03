import { Observable } from 'rxjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Ilist } from '../../shared/interface/IList.interface';

export interface IDatabase<Entity, DTO> {
    findAll(): Observable<Entity[]>;

    findAllBy(pageNumber: number, pageSize: number, condition: object, relations: []): Observable<Ilist<Entity>>;

    findOne(key: string, value: string | number, relations: []): Observable<Entity>;

    insert(data: any): Observable<any>;

    update(id: number, data: QueryDeepPartialEntity<Entity>): Observable<string>;

    delete(id: number): Observable<string>;
}
