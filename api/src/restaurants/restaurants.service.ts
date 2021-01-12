import { StatusEnum } from './../orders/status';
import { OrdersService } from 'src/orders/orders.service';
import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/orders/schemas/order.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    private httpService: HttpService,
    private orderService: OrdersService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const created = new this.restaurantModel(createRestaurantDto);
    return created.save();
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().exec();
  }

  async findOne(id: string): Promise<Restaurant> {
    return this.findRestaurant(id);
  }

  async updateOne(
    id: string,
    restaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findRestaurant(id);
    Object.assign(restaurant, { ...restaurantDto });
    return restaurant.save();
  }

  async startOrder(order: Order) {
    const restaurant = this.findRestaurant(order.restaurant['_id'])
    console.log(order['_id']);
    
    return this.httpService.post(`http://192.168.178.40:80/order?PreperationTime=6000&orderID=${order['_id']}`).subscribe((res) => {
      this.orderService.updateOne(order['_id'], {
        status: StatusEnum.Preparing
      })
    },
    (err) => {
      console.log(
        err.response || 'Restaurant cannot be reached, might be offline ',
      );
    });
  }

  private async findRestaurant(id: string): Promise<RestaurantDocument> {
    let restaurant;
    try {
      restaurant = await this.restaurantModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(
        'No restaurant found with the given id',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!restaurant) {
      throw new HttpException(
        'No restaurant found with the given id',
        HttpStatus.NOT_FOUND,
      );
    }
    return restaurant;
  }
}
