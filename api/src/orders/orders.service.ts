import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { RobotsService } from 'src/robots/robots.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-restaurant.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { StatusEnum } from './status';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private robotService: RobotsService,
    @Inject(forwardRef(() => RestaurantsService))
    private restaurantService: RestaurantsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel(createOrderDto);
    return order.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort('-createdAt').exec();
  }

  async findAllForUser(user): Promise<Order[]> {
    return this.orderModel
      .find({
        user: user,
      })
      .sort('-createdAt')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    return this.findOrder(id);
  }

  async updateOne(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOrder(id);
    Object.assign(order, { ...updateOrderDto });
    return order.save();
  }

  async addTemperature(id: string, temperature) {
    const order = await this.findOrder(id);
    order.temperatureHistory.push({
      temperature,
      timestamp: new Date(),
    });
    return order.save();
  }

  async checkForQueuedOrder() {
    // Check all restaurants for queued order but limit by 1 for each restaurant
    const queuedOrdersPerRestaurant = await this.orderModel.aggregate([
      {
        $match: {
          status: StatusEnum.Created,
        },
      },
      {
        $group: {
          _id: '$restaurant',
          ids: {
            $push: {
              id: '$_id',
            },
          },
          x: { $first: '$restaurant' },
        },
      },
      {
        $project: {
          ids: { $slice: ['$ids', 1] },
        },
      },
    ]);

    const queuedOrdersIds = queuedOrdersPerRestaurant.map((restaurant) => {
      return restaurant.ids[0].id;
    });

    const queuedOrders = await this.orderModel.find({
      _id: { $in: queuedOrdersIds },
    });

    queuedOrders.forEach(async (order) => {
      // await start order before 2 order pick the same robot
      await this.startOrder(order);
    });
  }

  async startOrder(order: Order) {
    // Check for available robot
    const robotAvailable = await this.robotService.isRobotAvailable();

    // Check if restaurant is available
    const restaurantAvailable = await this.isRestaurantAvailable(
      order.restaurant,
    );

    if (robotAvailable && restaurantAvailable) {
      this.robotService.startRobot(order);
      this.restaurantService.startOrder(order);
    }
    return;
  }

  async isRestaurantAvailable(restaurant) {
    const exists = await this.orderModel.exists({
      $and: [
        {
          $or: [
            {
              status: StatusEnum.Prepared,
            },
            {
              status: StatusEnum.Preparing,
            },
          ],
        },
        {
          restaurant,
        },
      ],
    });
    return !exists;
  }

  private async findOrder(id: string): Promise<OrderDocument> {
    let order;
    try {
      order = await this.orderModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(
        'No order found with the given id',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!order) {
      throw new HttpException(
        'No order found with the given id',
        HttpStatus.NOT_FOUND,
      );
    }
    return order;
  }
}
