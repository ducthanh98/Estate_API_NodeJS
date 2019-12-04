import { Module } from '@nestjs/common';
import { RentHostelController } from './rent-hostel.controller';
import { RentHostelService } from './rent-hostel.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [
    RentHostelController,
  ],
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [RentHostelService]
})
export class RentHostelModule { }
