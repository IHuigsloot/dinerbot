import { OrdersService } from 'src/orders/orders.service';
import { InjectModel } from '@nestjs/mongoose';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import {
  HttpService,
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PathingService } from 'src/pathing/pathing.service';
import { Robot, RobotDocument } from './robot.schema';
import { Model } from 'mongoose';
import { InitRobotDto } from './dto/init-robot.dto';
import { Order } from 'src/orders/schemas/order.schema';
import { StatusEnum } from 'src/orders/status';

@Injectable()
export class RobotsService {
  constructor(
    @InjectModel(Robot.name)
    private robotModel: Model<RobotDocument>,
    private httpService: HttpService,
    private pathingService: PathingService,
    @Inject(forwardRef(() => RestaurantsService))
    private restaurantService: RestaurantsService,
    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
  ) {}

  async findNearestRobot(restaurantLocation) {
    let nearestRobot;
    let lowestWeight;
    // TODO execute pathing and compare weight
    const nearestRobots = await this.robotModel
      .find({
        currentOrder: null,
      })
      .exec();
    for (let i = 0; i < nearestRobots.length; i++) {
      // execute findnearest paths
      const path = this.pathingService.findShortestPath(
        nearestRobots[i].location,
        restaurantLocation,
      );

      // Compare weight IF lower overwrite nearest robot
      if (nearestRobot === undefined || lowestWeight > path.distance) {
        nearestRobot = nearestRobots[i];
        lowestWeight = path.distance;
      }
    }
    return nearestRobot;
  }

  async isRobotAvailable() {
    return this.robotModel.exists({
      currentOrder: null,
    });
  }

  async clearOrder(orderId: string) {
    const robot = await this.findRobotByOrder(orderId);
    robot.currentOrder = null;
    robot.save();
  }

  async getRestaurantLocation(id) {
    const restaurant = await this.restaurantService.findOne(id);
    return restaurant.location;
  }

  sendPathToRobot(ipAdress, startLocation, endLocation, order) {
    const pathToRestaurant = this.pathingService.findShortestPath(
      startLocation,
      endLocation,
    );
    order.path.push({
      pathToRestaurant,
    });
    order.save();

    this.httpService
      .post(`http://${ipAdress}/order`, {
        steps: pathToRestaurant.actions,
      })
      .subscribe(
        async (res) => {
          const robot = await this.findRobotByIp(ipAdress);
          Object.assign(robot, { currentOrder: order['_id'] });
          await robot.save();

          if (order?.status === 'delivery') {
            this.orderService.updateOne(order['_id'], {
              status: StatusEnum.Delivery,
            });
          }
        },
        (err) => {
          console.log(
            err.response || 'Robot cannot be reached, might be offline ',
          );
        },
      );
  }

  async startRobot(order) {
    const restaurantLocation = await this.getRestaurantLocation(
      order.restaurant,
    );
    const nearestRobot = await this.findNearestRobot(restaurantLocation);

    return this.sendPathToRobot(
      nearestRobot?.ip || '0.0.0.0',
      nearestRobot?.location || 'A1',
      restaurantLocation,
      order,
    );
  }

  async sendRobotToHome(order: Order) {
    try {
      const robot = await this.findRobotByOrder(order['_id']);
      return this.sendPathToRobot(
        robot.ip,
        order.restaurant.location,
        order.destination,
        order,
      );
    } catch (error) {
      return;
    }
  }

  async initRobot(initRobotDto: InitRobotDto) {
    let robot = await this.robotModel
      .findOne({
        ip: initRobotDto.ip,
      })
      .exec();

    if (robot) {
      Object.assign(robot, { ...initRobotDto });
    } else {
      robot = new this.robotModel(initRobotDto);
    }
    return robot.save();
  }

  async changeLocation(robot: RobotDocument, action: string) {
    switch (action) {
      case 'R':
        if (robot.direction === 3) {
          robot.direction = 0;
        } else {
          robot.direction = robot.direction + 1;
        }
        break;
      case 'L':
        if (robot.direction === 0) {
          robot.direction = 3;
        } else {
          robot.direction = robot.direction - 1;
        }
        break;
      case 'F':
        // Robot drives forward check direction to change location
        switch (robot.direction) {
          case 0:
            robot.location =
              robot.location[0] + (parseInt(robot.location.substring(1)) - 1);
            break;
          case 1:
            robot.location =
              String.fromCharCode(robot.location[0].charCodeAt(0) + 1) +
              robot.location[1];
            break;
          case 2:
            robot.location =
              robot.location[0] + (parseInt(robot.location.substring(1)) + 1);
            break;
          case 3:
            robot.location =
              String.fromCharCode(robot.location[0].charCodeAt(0) - 1) +
              robot.location[1];
            break;
        }
        break;
    }

    return robot.save();
  }

  async findRobotByIp(ip): Promise<RobotDocument> {
    let robot;
    try {
      robot = await this.robotModel
        .findOne({
          ip,
        })
        .exec();
    } catch (error) {
      throw new HttpException(
        'No robot found with the given ip',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!robot) {
      throw new HttpException(
        'No robot found with the given ip',
        HttpStatus.NOT_FOUND,
      );
    }
    return robot;
  }

  async findRobotByOrder(orderId): Promise<RobotDocument> {
    let robot;
    try {
      robot = await this.robotModel
        .findOne({
          currentOrder: orderId,
        })
        .exec();
    } catch (error) {
      throw new HttpException(
        'No robot found with the given order',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!robot) {
      throw new HttpException(
        'No robot found with the given order',
        HttpStatus.NOT_FOUND,
      );
    }
    return robot;
  }
}
