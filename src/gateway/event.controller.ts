
import { Controller, Get, Inject } from '@nestjs/common';

import { Cache } from 'cache-manager';  
import { WebSocketService } from './web-socket.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import axios from "axios"
@Controller()
export class EventController { 

    constructor(
        private readonly eventService: WebSocketService,
        // @Inject("CACHE_MANAGER") private cacheManager: Cache,
        private readonly redisService: RedisService
    ) {}

    @Get('api/hello')
    async getHello(){
      // Upbit API에서 지원하는 메시지 형식 예시
      const message = [{"ticket":"test"},{"type":"ticker","codes":["KRW-BTC"]}];
      const market = await axios.get('https://api.upbit.com/v1/market/all')
      const marketData = market.data.map((item:any)=>item.market).filter((item:any)=>item.includes('KRW'))
    //   // WebSocket 클라이언트로 메시지 전송
    //   const res= await this(message);
        // const res = await this.cacheManager.get('KRW-BTC')
        const res = await this.redisService.getClient().mget(marketData)
        const response = res.map((item:any)=>JSON.parse(item!.toString()))
        return response;
    }

}
