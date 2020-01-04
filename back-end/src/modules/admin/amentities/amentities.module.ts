import { Module } from '@nestjs/common';
import { AmentitiesService } from './amentities.service';
import { AmentitiesController } from './amentities.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [

  ],
  controllers: [AmentitiesController],
  providers: [AmentitiesService],
})
export class AmentitiesModule { }
