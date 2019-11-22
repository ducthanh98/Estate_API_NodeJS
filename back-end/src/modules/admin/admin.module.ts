import { Module } from '@nestjs/common';
import { AmentitiesModule } from './amentities/amentities.module';

@Module({
  imports: [AmentitiesModule],
})
export class AdminModule { }
