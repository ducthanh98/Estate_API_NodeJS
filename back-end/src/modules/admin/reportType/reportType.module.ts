import { Module } from '@nestjs/common';
import { ReportTypeService } from './reportType.service';
import { ReportTypeController } from './reportType.controller';

@Module({
  providers: [ReportTypeService],
  controllers: [ReportTypeController],
})
export class ReportTypeModule { }
