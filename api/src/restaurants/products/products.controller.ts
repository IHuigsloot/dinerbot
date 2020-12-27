import {
  Body,
  Controller,
  createParamDecorator,
  Delete,
  ExecutionContext,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RestaurantGuard } from 'src/restaurants/products/restaurant-guard';
import { CreateProductDto } from '../dto/create-product.dto';
import { Restaurant } from '../schemas/restaurant.schema';
import { ProductsService } from './products.service';

const RestaurantDeco = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.restaurant;
  },
);

@Controller('restaurants/:restaurant/products')
@UseGuards(RestaurantGuard)
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  getAllForRestaurant(@Param('restaurant') restaurantId: string) {
    return this.productService.findAllForRestaurant(restaurantId);
  }

  @Post()
  createForRestaurant(
    @Param('restaurant') restaurantId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createForRestaurant(
      restaurantId,
      createProductDto,
    );
  }

  @Put(':id')
  updateForRestaurant(
    @RestaurantDeco() restaurant: Restaurant,
    @Param('id') productId: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productService.updateForRestaurant(
      restaurant,
      productId,
      updateProductDto,
    );
  }

  @Delete(':id')
  deleteForRestaurant(
    @RestaurantDeco() restaurant: Restaurant,
    @Param('id') productId: string,
  ) {
    return this.productService.deleteFromRestaurant(restaurant, productId);
  }
}
