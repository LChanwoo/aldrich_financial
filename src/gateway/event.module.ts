
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { EventController } from './event.controller';
import { WebSocketService } from './web-socket.service';
import { RedisService, RedisModule } from '@liaoliaots/nestjs-redis';
import { CoinPriceGateway } from './coin-price.gateway';

@Module({
    imports: [
      ConfigModule.forRoot(),   
      RedisModule.forRoot({
        config: {
          host: '0.0.0.0',
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
