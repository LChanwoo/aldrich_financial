import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Controller, Get, Query, Render } from '@nestjs/common';
import Redis from 'ioredis';

@Controller()
export class AppController {

  constructor(
  ){}

  @Render('login')
  @Get()
  public index(@Query('name') name?: string) {
    return { name };
  }

  @Render('about')
  @Get('/about')
  public about() {
    return {};
  }

  @Render('charts')
  @Get('/charts')
  public chart() {
    return {};
  }
  @Render('dashboard')
  @Get('/dashboard')
  public dashboard() {
    return {};
  }
  @Render('forms')
  @Get('/example/cards')
  public forms() {
    return {};
  }

}
