import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { PathingModule } from './../pathing/pathing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule, Module } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { RobotsController } from './robots.controller';
import { Robot, RobotSchema } from './robot.schema';

@Module({
  imports: [
    HttpModule.register({
      timeout: 3000,
    }),
    MongooseModule.forFeature([{ name: Robot.name, schema: RobotSchema }]),
    PathingModule,
    RestaurantsModule,
  ],
  providers: [RobotsService],
  controllers: [RobotsController],
  exports: [RobotsService],
})
export class RobotsModule {}
