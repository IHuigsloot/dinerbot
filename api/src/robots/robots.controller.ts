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

    this.robotsService
      .changeLocation(robot, sensorDataDto.action)
      .then((newRobot) => {
        this.gateway.sendOrderUpdate({
          robot: newRobot,
          order,
        });
        robot = newRobot;
      });

    if (order.status == StatusEnum.Delivery) {
      order = await this.orderService.addTemperature(
        robot.currentOrder,
        sensorDataDto.temperature,
      );
    }

    if (
      order.status == StatusEnum.Delivery &&
      robot.direction == 0 &&
      order.destination === robot.location
    ) {
      this.gateway.sendOrderUpdate({
        robot: robot,
        order,
      });
      this.orderService
        .updateOne(order['_id'], {
          status: StatusEnum.Delivered,
        })
        .then((order) => {
          this.gateway.sendOrderUpdate({
            robot: robot,
            order,
          });
        });
      await this.robotsService.clearOrder(order['_id']);
      this.orderService.checkForQueuedOrder();
    }

    return order;
  }
}
