import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import axios from "axios"
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
const wsUrl = 'wss://api.upbit.com/websocket/v1';

@Injectable()
export class WebSocketService {

    private ws: WebSocket = new WebSocket(wsUrl);
    
    constructor(
        @InjectRedis() private readonly redis: Redis
    ) {

        this.ws.on('open', async function() {
            const market = await axios.get('https://api.upbit.com/v1/market/all')
            const marketData = await market.data.map((item:any)=>item.market).filter((item:any)=>item.includes('KRW'))
            await redis.set("marketData",marketData.toString())
            const request = [{"ticket":"test"},{"type":"trade","codes":marketData}]
            this.send(JSON.stringify(request));
            console.log('Upbit WebSocket 연결 성공');
        });

        this.ws.on('message', async function (data : any) {
            const message = JSON.parse(data)
            await redis.set(message.code, data)
        });
    }


}
