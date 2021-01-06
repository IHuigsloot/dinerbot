import { Module } from '@nestjs/common';
import { PathingService } from './pathing.service';
import { PathingController } from './pathing.controller';

@Module({
  providers: [PathingService],
  controllers: [PathingController],
  exports: [PathingService],
})
export class PathingModule {}
