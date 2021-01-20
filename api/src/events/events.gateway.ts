import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { OrderUpdateEvent } from './OrderUpdateEvent';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  sendLocationUpdate(payload: OrderUpdateEvent) {
    this.server.clients.forEach((client) => {
      client.send(JSON.stringify(payload));
    });
  }
}
