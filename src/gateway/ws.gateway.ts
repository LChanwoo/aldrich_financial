import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import WebSocket from 'ws';

@WebSocketGateway()
export class UpbitGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private client: WebSocket;

  afterInit(server: any) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: WebSocket) {
    console.log('WebSocket Client Connected');
  }

  handleDisconnect(client: WebSocket) {
    console.log('WebSocket Client Disconnected');
  }

  sendMessage(message: string) {
    this.client.send(message);
  }

  handleMessage(message: string) {
    console.log('WebSocket Client Received Message:', message);
  }
}
