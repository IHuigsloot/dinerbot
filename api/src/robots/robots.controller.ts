import { StatusEnum } from './../orders/status';
import { RobotsService } from './robots.service';
import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { SendSensorDataDto } from './dto/send-sensor-data';
import { InitRobotDto } from './dto/init-robot.dto';
import { OrdersService } from 'src/orders/orders.service';
import { EventsGateway } from 'src/events/events.gateway';

@Controller('robots')
export class RobotsController {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
    private robotsService: RobotsService,
    private gateway: EventsGateway,
  ) {}

  @Post('me')
  initRobot(@Body() initRobotDto: InitRobotDto) {
    return this.robotsService.initRobot(initRobotDto);
  }

  @Post('data')
  async sendSensorData(@Body() sensorDataDto: SendSensorDataDto) {
    let robot = await this.robotsService.findRobotByIp(sensorDataDto.ip);
    let order = await this.orderService.findOne(robot.currentOrder);

    robot = await this.robotsService.changeLocation(
      robot,
      sensorDataDto.action,
    );
    this.gateway.sendLocationUpdate({
      robot,
      order,
    });

    if (order.status == StatusEnum.Delivery) {
      order = await this.orderService.addTemperature(
        robot.currentOrder,
        sensorDataDto.temperature,
      );
    }

    if (order.destination === robot.location) {
      await this.orderService.updateOne(order['_id'], {
        status: StatusEnum.Delivered,
      });
    }

    return order;
  }
}
