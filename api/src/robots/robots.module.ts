import { OrdersModule } from './../orders/orders.module';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { PathingModule } from './../pathing/pathing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { RobotsController } from './robots.controller';
import { Robot, RobotSchema } from './robot.schema';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Robot.name, schema: RobotSchema }]),
    forwardRef(() => OrdersModule),
    forwardRef(() => RestaurantsModule),
    HttpModule.register({
      timeout: 8000,
    }),
    PathingModule,
    EventsModule,
  ],
  providers: [RobotsService],
  controllers: [RobotsController],
  exports: [RobotsService],
})
export class RobotsModule {}
