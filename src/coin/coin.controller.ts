import { Controller, Get, Req, UseGuards, Body, Post } from '@nestjs/common';
import { SessionGuard } from '../auth/session.guard';
import { LocalAuthGuard } from '../auth/auth.guard';
import { LoginDto } from '../auth/dto/login.dto';
import { User } from '../common/decorators/user.decorator';
import { CoinService } from './coin.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('')
export class CoinController {
  constructor(
    private readonly coinService: CoinService,
  ) {}

  @Get('/api/coinPrice')
  @UseGuards(AuthenticatedGuard)
  public async coinPrice(@Req() req:any) {
    return this.coinService.coinPrice(req.user);
  }

  @Post('/api/order')
  @UseGuards(AuthenticatedGuard)
  public async order(@Body() body: any ,@User() user:LoginDto){
    return this.coinService.order(body, user);
  }
}
