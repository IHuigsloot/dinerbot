import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RobotDocument } from 'src/robots/robot.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-restaurant.dto';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel(createOrderDto);
    return order.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findAllForUser(user): Promise<Order[]> {
    return this.orderModel
      .find({
        user: user,
      })
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

  async changeLocation(robot: RobotDocument, action: string) {
    switch (action) {
      case "R":
        if (robot.direction === 3) {
          robot.direction = 0
        } else {
          robot.direction = robot.direction + 1;
        }
        break;
      case "L":
        if (robot.direction === 0) {
          robot.direction = 3
        } else {
          robot.direction = robot.direction - 1;
        }
        break;
      case "F":
        // Robot drives forward check direction to change location
        switch (robot.direction) {
          case 0:
            robot.location = robot.location[0] + (parseInt(robot.location[1]) - 1)
            break;
          case 1:
            robot.location = String.fromCharCode(robot.location[0].charCodeAt(0) + 1) + robot.location[1]
            break;
          case 2:
            robot.location = robot.location[0] + (parseInt(robot.location[1]) + 1)
            break;
          case 3:
            robot.location = String.fromCharCode(robot.location[0].charCodeAt(0) - 1) + robot.location[1]
            break;
        }
        break;
    }    
    // robot.location = "test";
    return robot.save();
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
