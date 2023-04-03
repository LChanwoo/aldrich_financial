import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import axios from "axios"
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

const wsUrl = 'wss://api.upbit.com/websocket/v1';

@Injectable()
export class WebSocketService {

    ws: WebSocket = new WebSocket(wsUrl);
    
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
            if(message){
                await redis.set(message.code, data)
            }else{
                console.log("이 메시지는 ",message)
            }
        });

        this.ws.on('close', function() {
            console.log('Upbit WebSocket 연결 종료');
            //재연결
            setTimeout(() => {
                console.log('Upbit WebSocket 다시 연결 시도중...');
                const ws = new WebSocket(wsUrl);
                ws.on('open', async function() {
                    const market = await axios.get('https://api.upbit.com/v1/market/all')
                    const marketData = await market.data.map((item:any)=>item.market).filter((item:any)=>item.includes('KRW'))
                    await redis.set("marketData",marketData.toString())
                    const request = [{"ticket":"test"},{"type":"trade","codes":marketData}]
                    ws.send(JSON.stringify(request));
                    console.log('Upbit WebSocket 연결 성공');
                });
                ws.on('message', async function (data : any) {
                    const message = JSON.parse(data)
                    if(message){
                        await redis.set(message.code, data)
                    }else{
                        console.log("이 메시지는 ",message)
                    }
                });
                ws.on('close', function() {
                    console.log('Upbit WebSocket 재연결 실패');
                });
            }, 1000);
        })
    }


}
