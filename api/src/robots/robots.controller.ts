import { RobotsService } from './robots.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('robots')
export class RobotsController {

    constructor(private robotsService: RobotsService)  {

    }

    @Post('me')
    initRobot() {
        // Set robot ip in database
    }

    @Post('location')
    updateLocation() {

    }

    @Get('test')
    test() {
        this.robotsService.startRobot('5ff58ac843caaefecf71091a', "B8");
    }
}
