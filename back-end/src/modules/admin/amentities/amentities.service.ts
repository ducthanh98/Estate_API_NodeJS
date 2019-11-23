import { Injectable } from '@nestjs/common';
import { AmentitiesEntity } from './../../../database/amentities.entity';
import { AmentitiesDTO } from './amentities.dto';
import { DatabaseHelper } from '../../../helpers/database.helper';

@Injectable()
export class AmentitiesService {
    private databaseHelper: DatabaseHelper<AmentitiesEntity, AmentitiesDTO>;
    onModuleInit() {
        this.databaseHelper = new DatabaseHelper<AmentitiesEntity, AmentitiesDTO>(AmentitiesEntity);
    }
    getAllBy(pageNumber = 1, pageSize = 10) {
        return this.databaseHelper.findAll();
    }
    create(amentities: AmentitiesDTO) {
        return this.databaseHelper.insert(amentities);
    }
    update(id: number, amentities: AmentitiesDTO) {
        return this.databaseHelper.update(id, amentities);
    }
    delete(id: number) {
        return this.databaseHelper.delete(id);
    }
}
