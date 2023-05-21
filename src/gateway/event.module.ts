
import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { EventController } from './event.controller';
import { WebSocketService } from './web-socket.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CoinPriceGateway } from './coin-price.gateway';

@Module({
    imports: [
      ConfigModule.forRoot(),   
      RedisModule.forRoot({
        config: {
          host: process.env.REDIS_HOSTNAME,
          port: 6379,
        }
      })
    ],
    controllers: [
      EventController
    ],
    exports: [
      WebSocketService,
      CoinPriceGateway
    ],
    providers: [
      WebSocketService,
      CoinPriceGateway
    ],
})
export class EventModule { }
