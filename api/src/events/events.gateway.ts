import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderUpdateEvent } from './OrderUpdateEvent';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() socket: Socket) {
    // console.log(socket);
  }

  @SubscribeMessage('user')
  setUserSocket(
    @MessageBody() user: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket);
  }

  sendLocationUpdate(payload: OrderUpdateEvent) {
    this.server.emit('update', payload);
  }
}
