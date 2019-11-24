import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            return false;
        }
        request.user = await this.validateToken(request.headers.authorization);
        return true;
    }
    async validateToken(token: string): Promise<string | object> {
        const splitToken = token.split(' ');
        if (splitToken[0] !== 'Bearer') {
            throw new HttpException('Invalid Token', HttpStatus.FORBIDDEN);
        }
        try {
            const decoded = await jwt.verify(splitToken[1], process.env.SECRET);
            return decoded;
        } catch (e) {
            Logger.error(`Error Token :`, e.stack, 'Auth Guard');
            throw new HttpException(`Error Token : ${e.message || e.name}`, HttpStatus.FORBIDDEN);
        }

    }
}
