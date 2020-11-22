import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway(8080)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @OnEvent('location.update')
  handleLocationUpdateEvent(payload) {
    this.server.clients.forEach((client) => {
      client.send(JSON.stringify(payload));
    });
  }
}
