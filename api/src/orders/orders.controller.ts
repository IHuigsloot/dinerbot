import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Api } from 'src/common/decorators/api.decorator';
import { OrdersService } from './orders.service';

@Api('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  create() {
    // Todo: Should create an order for the given user.
    throw new HttpException('Not yet implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  @Get()
  findAll() {
    // Todo: Should return all orders (active & history)
    // For users it should only return their orders, for admins (dashboard it should return all orders)

    this.eventEmitter.emit('location.update', {
      x: 5,
      y: 7,
    });

    return 'test';

    throw new HttpException('Not yet implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Todo: Should return a single order
    throw new HttpException('Not yet implemented', HttpStatus.NOT_IMPLEMENTED);
  }
}
