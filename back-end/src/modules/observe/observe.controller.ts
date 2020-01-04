import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { ObserveService } from './observe.service';
import { IReponse } from 'src/shared/interface/ireponse.interface';
import { Code } from './../../constants/code.enum';
import { NotificationContant } from 'src/constants/notification.constant';

@Controller('observe')
export class ObserveController {
    constructor(private observeService: ObserveService) { }
    @Post('register')
    registerSubcribe(@Res() res, @Body() data: any, @Req() req) {
        return this.observeService.subcribeEmail(data.email, req.protocol, req.get('host'))
        .subscribe(
            () => {
                const response: IReponse<any> = {
                    statusCode: Code.SUCCESS,
                    message: NotificationContant.SUCCESS,
                };
                res.json(response);
            }, (err) => {
                const response: IReponse<any> = {
                    statusCode: Code.ERROR,
                    message: err.message,
                };
                res.json(response);
            },
        );
    }
}
