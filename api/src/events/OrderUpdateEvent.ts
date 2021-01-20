import { Order } from 'src/orders/schemas/order.schema';
import { Robot } from 'src/robots/robot.schema';

export class OrderUpdateEvent {
  order: Order;
  robot: Robot;
}
