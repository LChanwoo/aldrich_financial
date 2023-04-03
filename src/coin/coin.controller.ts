import { Controller, Get, Req, UseGuards, Body, Post, UseFilters, Delete } from '@nestjs/common';
import { SessionGuard } from '../auth/session.guard';
import { LocalAuthGuard } from '../auth/auth.guard';
import { LoginDto } from '../auth/dto/login.dto';
import { User } from '../common/decorators/user.decorator';
import { CoinService } from './coin.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { TransactionDto } from './dto/transaction.dto';
import { UserDataDto } from '../user/dto/userData.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { DeleteTransactionDto } from './dto/deleteTransaction.dto';

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
  @UseFilters(new HttpExceptionFilter())
    public async order(@Body() transactionDto: TransactionDto ,@User() user:UserDataDto){
    return this.coinService.order(transactionDto, user);
  }

  @Delete('/api/userdata')
  public async deleteUserData(@User() user:UserDataDto) {
    return this.coinService.deleteUserData(user);
  }

  @Delete('/api/transaction')
  public async deleteTransaction(@Body() body :DeleteTransactionDto, @User() user:UserDataDto) {
    return this.coinService.delete_non_concluded_transcation(body,user);
  }
}

