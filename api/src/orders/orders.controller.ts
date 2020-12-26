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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Api } from 'src/common/decorators/api.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { Request } from 'express';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { UpdateOrderDto } from './dto/update-restaurant.dto';

@Api('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private eventEmitter: EventEmitter2,
    private restaurantService: RestaurantsService,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = { ...createOrderDto, user: request['user'] };

    await this.restaurantService.findOne(createOrderDto.restaurant); // Validate restaurant

    return this.orderService.create(order);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOne(id, updateOrderDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.orderService.findAllForUser(request['user']);
  }

  @Get(':id')
  async findOne(@Req() request: Request, @Param('id') id: string) {
    const order = await this.orderService.findOne(id);
    if (order.user !== request['user']) {
      throw new HttpException(
        'Your not authorized to view this order',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return order;
  }
}
