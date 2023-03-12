import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/login.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class CoinService {

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) { }

  public async coinPrice(user : LoginDto) {
      const redisMarketData = await this.redisService.getClient().get("marketData")
      const marketData = redisMarketData!.toString().split(",")
      const coinPrice = await this.redisService.getClient().mget(marketData)
      const userData = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ['transactions', 'portfolios', 'portfolios.coin'],
      });
      console.log(userData)
      const balance = userData.balance;
      const availableBalance = userData.availableBalance;
    return { 
      coinPrice,
      balance,
      availableBalance
     };
  }

  public async order(body: any, user: LoginDto) {
    if(body.select==="매수"){
      return this.purchaseCoin(body, user);
    }
    else if(body.select==="매도"){
      return this.sellCoin(body, user);
    }
    return new HttpException('잘못된 요청입니다.', 400);

  }

  private async purchaseCoin(body: any, user: LoginDto) {
    // const userData = await this.userRepository.findOne({
    //   where: { email: user.email },
    //   relations: ['transactions', 'portfolios', 'portfolios.coin'],
    // });
    // const balance = userData.balance;
    // const availableBalance = userData.availableBalance;
    // const coinPrice = await this.redisService.getClient().get(body.coinName).
    // const coinAmount = body.coinAmount;
    // const totalPrice = coinPrice * coinAmount;
    // const portfolio = userData.portfolios.find((portfolio) => portfolio.coin.name === body.coinName);
    // if (portfolio) {
    //   portfolio.amount += coinAmount;
    //   await this.userRepository.save(userData);
    // } else {
    //   const newPortfolio = this.userRepository.create({
    //     coin: { name: body.coinName },
    //     amount: coinAmount,
    //   });
    //   userData.portfolios.push(newPortfolio);
    //   await this.userRepository.save(userData);
    // }
    // const newTransaction = this.userRepository.create({
    //   coin: { name: body.coinName },
    //   amount: coinAmount,
    //   price: coinPrice,
    //   type: '매수',
    // });
    // userData.transactions.push(newTransaction);
    // userData.balance -= totalPrice;
    // userData.availableBalance -= totalPrice;
    // await this.userRepository.save(userData);
  }

  private async sellCoin(body: any, user: LoginDto) {
    // const userData = await this.userRepository.findOne({
    //   where: { email: user.email },
    //   relations: ['transactions', 'portfolios', 'portfolios.coin'],
    // });
    // const balance = userData.balance;
    // const availableBalance = userData.availableBalance;
    // const coinPrice = await this.redisService.getClient().get(body.coinName);
    // const coinAmount = body.coinAmount;
    // const totalPrice = coinPrice * coinAmount;
    // const portfolio = userData.portfolios.find((portfolio) => portfolio.coin.name === body.coinName);
    // if (portfolio) {
    //   portfolio.amount -= coinAmount;
    //   await this.userRepository.save(userData);
    // }
    // const newTransaction = this.userRepository.create({
    //   coin: { name: body.coinName },
    //   amount: coinAmount,
    //   price: coinPrice,
    //   type: '매도',
    // });
    // userData.transactions.push(newTransaction);
    // userData.balance += totalPrice;
    // userData.availableBalance += totalPrice;
    // await this.userRepository.save(userData);
  }
}


