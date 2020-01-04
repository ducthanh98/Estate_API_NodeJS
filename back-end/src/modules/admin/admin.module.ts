import { Module } from '@nestjs/common';
import { AmentitiesModule } from './amentities/amentities.module';
import { ReportTypeModule } from './reportType/reportType.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [AmentitiesModule, ReportTypeModule, ReportModule],
})
export class AdminModule { }
