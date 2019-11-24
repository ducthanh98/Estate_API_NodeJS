import { Module } from '@nestjs/common';
import { AmentitiesModule } from './amentities/amentities.module';
import { ReportTypeModule } from './reportType/reportType.module';

@Module({
  imports: [AmentitiesModule, ReportTypeModule],
})
export class AdminModule { }
