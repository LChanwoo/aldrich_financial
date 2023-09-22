import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Controller, Get, Query, Redirect, Render, Req, UseFilters, UseGuards } from '@nestjs/common';
import Redis from 'ioredis';
import { LocalAuthGuard } from './auth/auth.guard';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { SessionGuard } from './auth/session.guard';
import { CoinService } from './coin/coin.service';
import { User } from './common/decorators/user.decorator';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { UserDataDto } from './user/dto/userData.dto';

@Controller()
export class AppController {

  constructor(
    private readonly coinService: CoinService,
  ){}

  @Get()
  @Redirect('/login', 307)
  public root() {
    return {};
  }

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
  @Render('create-account')
  @Get('/create-account')
  public createAccount() {
    return {};
  }
  
  @Render('dashboard')
  @Get('/dashboard')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(new HttpExceptionFilter())
  public async dashboard(@Req() req:any, @User() user:UserDataDto) {
    const props = this.coinService.coinPrice(user);
    return { props };
  }

  @Render('myhistory')
  @Get('/myhistory')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(new HttpExceptionFilter())
  public myhistory(@Req() req:any, @User() user:UserDataDto) {
    const props = this.coinService.myTransaction(user);
    return { props };
  }
  @Render('news')
  @Get('/news')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(new HttpExceptionFilter())
  public news() {
    return {};
  }
  @Render('ranking')
  @Get('/ranking')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(new HttpExceptionFilter())
  public ranking() {
    return {};
  }

  @Render('portfolio')
  @Get('/portfolio')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(new HttpExceptionFilter())
  public portfolio() {
    return {};
  }

}
