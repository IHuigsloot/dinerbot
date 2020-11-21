import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway(8080)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @OnEvent('location.update')
  handleLocationUpdateEvent() {
    const obj = {
      x: 5,
      y: 6,
    };

    this.server.clients.forEach((client) => {
      client.send(JSON.stringify(obj));
    });
  }
}
