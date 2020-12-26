import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(CreateRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const created = new this.restaurantModel(CreateRestaurantDto);
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
    return Object.assign(restaurant, { ...restaurantDto });
  }

  private async findRestaurant(id: string): Promise<Restaurant> {
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
