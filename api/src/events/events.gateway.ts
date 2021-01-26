import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderUpdateEvent } from './OrderUpdateEvent';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('order')
  setUserSocket(
    @MessageBody() orderId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket);
  }

  async sendOrderUpdate(payload: OrderUpdateEvent) {
    this.server.emit('update', payload);
  }
}
