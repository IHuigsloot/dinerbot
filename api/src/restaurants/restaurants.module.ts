import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { Product, ProductSchema } from './products/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [RestaurantsController, ProductsController],
  providers: [RestaurantsService, ProductsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
