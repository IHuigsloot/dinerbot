import { StatusEnum } from './../orders/status';
import { RobotsService } from './robots.service';
import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { SendSensorDataDto } from './dto/send-sensor-data';
import { InitRobotDto } from './dto/init-robot.dto';
import { OrdersService } from 'src/orders/orders.service';

@Controller('robots')
export class RobotsController {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
    private robotsService: RobotsService,
) {}

  @Post('me')
  initRobot(@Body() initRobotDto: InitRobotDto) {
    return this.robotsService.initRobot(initRobotDto);
  }

  @Post('data')
  async sendSensorData(@Body() sensorDataDto: SendSensorDataDto) {
    const robot = await this.robotsService.findRobotByIp(sensorDataDto.ip);
    await this.orderService.changeLocation(robot, sensorDataDto.action);

    const order = await this.orderService.findOne(robot.currentOrder);

    if (order.status == StatusEnum.Delivery) {
      await this.orderService.addTemperature(robot.currentOrder, sensorDataDto.temperature);
      await this.orderService.changeLocation(robot, sensorDataDto.action);
    }
    return order;
  }
}
