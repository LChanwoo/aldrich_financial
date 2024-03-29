import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
@Injectable()
@WebSocketGateway({ namespace: 'ws-coin-price' })
export class CoinPriceGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    @InjectRedis() private readonly redisService: Redis,
  ) {}

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.startCoinPriceSubscription(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  startCoinPriceSubscription(client: Socket, ...args: any[]) {
    const interval = setInterval(async () => {
      const redisMarketData = await this.redisService.get("marketData")
      if(redisMarketData){
        const marketData = redisMarketData!.toString().split(",")
        const coinPrice = await this.redisService.mget(marketData)
        if(coinPrice){
          client.emit('coinPriceUpdate', coinPrice.map((item:any)=>JSON.parse(item)));
        }
      }
    }, 1000);
  }
}
