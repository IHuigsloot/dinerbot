import { StatusEnum } from './../orders/status';
import { OrdersService } from 'src/orders/orders.service';
import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/orders/schemas/order.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { InitRestaurantDto } from './dto/init-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    private httpService: HttpService,
    private orderService: OrdersService,
  ) {}

  async initRestaurant(initRestaurantDto: InitRestaurantDto) {
    let restaurant = await this.restaurantModel
      .findOne({
        _id: initRestaurantDto.restaurant,
      })
      .exec();

    if (restaurant) {
      Object.assign(restaurant, { ...initRestaurantDto });
    } else {
      restaurant = new this.restaurantModel(initRestaurantDto);
    }
    return restaurant.save();
  }

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
    const restaurant = await this.findRestaurant(order.restaurant['_id']);
    if (!restaurant.ip) {
      // TODO: fallback url, one of the existings urls
      restaurant.ip = '192.168.178.13';
    }

    return this.httpService
      .post(
        `http://${restaurant.ip}/order?PreperationTime=${
          order.preperationTime * 1000
        }&orderID=${order['_id']}`,
      )
      .subscribe(
        (res) => {
          this.orderService.updateOne(order['_id'], {
            status: StatusEnum.Preparing,
          });
        },
        (err) => {
          console.log(
            err.response || 'Restaurant cannot be reached, might be offline ',
          );
        },
      );
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
