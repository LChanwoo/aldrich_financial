import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Controller, Get, Query, Render, Req, UseFilters, UseGuards } from '@nestjs/common';
import Redis from 'ioredis';
import { LocalAuthGuard } from './auth/auth.guard';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { SessionGuard } from './auth/session.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Controller()
export class AppController {

  constructor(
  ){}

  @Render('login')
  @Get("/login")
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
  @UseGuards(AuthenticatedGuard)
  @UseFilters(new HttpExceptionFilter())
  public dashboard(@Req() req:any) {
    // console.log("꺄ㅏㅏㅏㅏㅏㅏㅏ1")
    // console.log(req.user)
    return {};
  }
  @Render('create-account')
  @Get('/create-account')
  public createAccount() {
    return {};
  }
  @Render('forms')
  @Get('/example/cards')
  public forms() {
    return {};
  }

}
