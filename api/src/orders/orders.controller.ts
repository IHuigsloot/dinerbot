import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Api } from 'src/common/decorators/api.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { Request } from 'express';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { UpdateOrderDto } from './dto/update-restaurant.dto';
import { ProductsService } from 'src/restaurants/products/products.service';
import { RobotsService } from 'src/robots/robots.service';
import { plainToClass } from 'class-transformer';
import { OrderProduct } from './schemas/order.schema';

@Api('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private restaurantService: RestaurantsService,
    private productsService: ProductsService,
    private robotService: RobotsService,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const { restaurant, products } = createOrderDto;

    await this.restaurantService.findOne(restaurant); // Validate restaurant

    const productIds = products.map((product) => product._id);
    const validatedProducts = await this.productsService.getProductsByIdFromRestaurant(
      restaurant,
      productIds,
    );

    if (validatedProducts.length !== products.length) {
      throw new HttpException(
        'Not all products are available',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newProducts: OrderProduct[] = [];
    for (let index = 0; index < validatedProducts.length; index++) {
      const plain = validatedProducts[index].toObject();
      const quantity = products.find((product) => plain._id == product._id)
        .quantity;
      plain.quantity = quantity;
      newProducts.push(
        plainToClass(OrderProduct, plain, {
          excludeExtraneousValues: true,
        }),
      );
    }

    createOrderDto.products = newProducts;

    const preperationTime = Math.max(
      ...newProducts.map((product) => {
        return product.preperationTime || 0;
      }),
    );

    const order = { ...createOrderDto, user: request['user'], preperationTime };
    return this.orderService.create(order).then((orderResponse) => {
      this.orderService.startOrder(orderResponse);
      return orderResponse;
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const updatedOrder = await this.orderService.updateOne(id, updateOrderDto);
    if (updatedOrder.status === 'delivery') {
      this.robotService.sendRobotToHome(updatedOrder);
      this.orderService.checkForQueuedOrder();
    }
    return updatedOrder;
  }

  @Get()
  findAll(@Req() request: Request) {
    if (request['user'] === 'admin') {
      return this.orderService.findAll();
    }
    return this.orderService.findAllForUser(request['user']);
  }

  @Get(':id')
  async findOne(@Req() request: Request, @Param('id') id: string) {
    const order = await this.orderService.findOne(id);
    if (request['user'] === 'admin') {
      return order;
    } else if (order.user !== request['user']) {
      throw new HttpException(
        'Your not authorized to view this order',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return order;
  }
}
