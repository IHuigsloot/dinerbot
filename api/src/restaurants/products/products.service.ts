import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { Restaurant } from '../schemas/restaurant.schema';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async findAllForRestaurant(restaurantId): Promise<Product[]> {
    return this.productModel
      .find({
        restaurant: restaurantId,
      })
      .exec();
  }

  async createForRestaurant(
    restaurantId: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const created = new this.productModel({
      ...createProductDto,
      restaurant: restaurantId,
    });
    return created.save();
  }

  async updateForRestaurant(
    restaurant: Restaurant,
    productId: string,
    upodateProductDto: CreateProductDto,
  ) {
    const product = await this.findProductFromRestaurant(productId, restaurant);
    Object.assign(product, { ...upodateProductDto });
    return product.save();
  }

  async deleteFromRestaurant(restaurant: Restaurant, productId: string) {
    const product = await this.findProductFromRestaurant(productId, restaurant);
    return product.deleteOne();
  }

  private async findProductFromRestaurant(
    productId: string,
    restaurant: Restaurant,
  ): Promise<ProductDocument> {
    let product;
    try {
      product = await this.productModel
        .findOne({
          _id: productId,
          restaurant: restaurant,
        })
        .exec();
    } catch (error) {
      throw new HttpException(
        'No product found with the given id',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!product) {
      throw new HttpException(
        'No product found with the given id',
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }
}
