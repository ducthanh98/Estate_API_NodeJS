import { Injectable, PipeTransform, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value, metadata: ArgumentMetadata) {
        if (value instanceof Object && this.isEmpty(value)) {
            throw new HttpException('Validation Failed: No body submitted', HttpStatus.BAD_REQUEST);
        }
        const { metatype, type } = metadata;
        if (type === 'custom') {
            return value;
        } else if (!metatype || !this.toValidate(metatype)) {
            return false;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new HttpException(`Validation Failed: ${this.formatErrors(errors)}`, HttpStatus.BAD_REQUEST);
        }
        return value;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }

    private formatErrors(errors: any[]) {
        return errors.map(err => {
            for (const prop in err.constraints) {
                if (err.constraints.hasOwnProperty(prop)) {
                    return err.constraints[prop];
                }
            }
        }).join(', ');
    }
    private isEmpty(value: any): boolean {
        if (Object.keys(value).length === 0) {
            return true;
        }
        return false;
    }
}
