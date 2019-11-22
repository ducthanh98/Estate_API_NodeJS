import { Module } from '@nestjs/common';
import { AmentitiesService } from './amentities.service';
import { AmentitiesController } from './amentities.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AmentitiesController],
  providers: [AmentitiesService]
})
export class AmentitiesModule { }
