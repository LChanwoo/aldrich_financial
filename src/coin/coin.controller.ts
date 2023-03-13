import { Controller, Get, Req, UseGuards, Body, Post } from '@nestjs/common';
import { SessionGuard } from '../auth/session.guard';
import { LocalAuthGuard } from '../auth/auth.guard';
import { LoginDto } from '../auth/dto/login.dto';
import { User } from '../common/decorators/user.decorator';
import { CoinService } from './coin.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { TransactionDto } from './dto/transaction.dto';
import { UserDataDto } from '../user/dto/userData.dto';

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
  public async order(@Body() transactionDto: TransactionDto ,@User() user:UserDataDto){
    return this.coinService.order(transactionDto, user);
  }
}
