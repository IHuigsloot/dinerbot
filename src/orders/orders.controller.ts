import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  create() {
    // Todo: Should create an order for the given user.
    throw new HttpException('Not yet implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  @Get()
  findAll() {
    // Todo: Should return all orders (active & history)
    // For users it should only return their orders, for admins (dashboard it should return all orders)
    throw new HttpException('Not yet implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Todo: Should return a single order
    throw new HttpException('Not yet implemented', HttpStatus.NOT_IMPLEMENTED);
  }
}
