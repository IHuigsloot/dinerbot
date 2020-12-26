import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
