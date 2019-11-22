import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('admin/amentities')
export class AmentitiesController {
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    uploadFile(@UploadedFile() files) {
        console.log(files);
    }
}
