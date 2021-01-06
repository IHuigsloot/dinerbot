import { Controller, Param, Post } from '@nestjs/common';
import { PathingService } from './pathing.service';

@Controller('pathing')
export class PathingController {
  constructor(private pathingService: PathingService) {}

  @Post(':start/:end')
  create(@Param('start') start: string, @Param('end') end: string): string {
    return (
      'This will create a path with: ' +
      this.pathingService.findShortestPath(start, end).path
    );
  }
}
