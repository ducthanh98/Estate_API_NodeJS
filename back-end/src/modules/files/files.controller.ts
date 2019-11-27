import { Controller, Post, UseInterceptors, UploadedFiles, Get, Res, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
@Controller('files')
export class FilesController {
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@UploadedFiles() files) {
        console.log(files);
    }
    @Get('get/:path')
    getFile(@Param('path') path: string, @Res() res: Response) {
        return res.sendFile(path, { root: 'uploads' });
    }
}
