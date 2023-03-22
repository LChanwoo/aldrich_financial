
import { Controller, Get, Inject } from '@nestjs/common';

import { Cache } from 'cache-manager';  
import { WebSocketService } from './web-socket.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import axios from "axios"
@Controller()
export class EventController {}
