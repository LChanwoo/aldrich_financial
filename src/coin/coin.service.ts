import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/login.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { TransactionDto } from './dto/transaction.dto';
import { Coin } from '../entities/Coin.entity';
import { Transaction } from '../entities/Transaction.entity';
import { Portfolio } from '../entities/Portfolio.entity';
import { UserDataDto } from '../user/dto/userData.dto';

@Injectable()
export class CoinService {

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,

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

  public async order(body: TransactionDto, user: UserDataDto) {
    if(body.transactionType==="매수"){
      return this.purchaseCoin(body, user);
    }
    else if(body.transactionType==="매도"){
      return this.sellCoin(body, user);
    }
    return new HttpException('잘못된 요청입니다.', 400);

  }

  private async purchaseCoin(body: TransactionDto, user: UserDataDto) {
    try{
      console.log("body",body)
      const deletePortfolio = await this.portfolioRepository.findOne({
        where: { user_id: user.id, market: body.coinName },
      });
      if(deletePortfolio){
        const res=await this.portfolioRepository.delete({id:deletePortfolio.id});
        console.log(res)
      }
      const userData = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ['transactions', 'portfolios'],
      });
      userData.availableBalance = userData.balance;
      await this.userRepository.save(userData);
      const portfolioall = await this.portfolioRepository.find({
        where: { user_id: userData.id },
      });
      console.log(portfolioall)
      const balance = userData.balance;
      const availableBalance = userData.availableBalance;
      const coinData = JSON.parse(await this.redisService.getClient().get(body.coinName))
      const coinPrice = body.price;
      const coinAmount = body.amount;
      const totalPrice = coinPrice * coinAmount;
      if(totalPrice>availableBalance){
        return new HttpException('잔액이 부족합니다.', 400);
      }
      const portfolio = userData.portfolios.find((portfolio) => portfolio.market === body.coinName);
      console.log(portfolio)
      if (portfolio) {
        portfolio.quantity += coinAmount;
        portfolio.totalInvested += totalPrice;
        portfolio.averagePrice = portfolio.totalInvested / portfolio.quantity;
        userData.availableBalance = availableBalance - totalPrice;

        await this.portfolioRepository.save(portfolio);
        await this.userRepository.save(userData);
      } else {
        const newPortfolio = this.portfolioRepository.create({
          user_id: user.id,
          market: body.coinName,
          quantity: coinAmount,
          averagePrice: coinPrice,
          totalInvested: totalPrice,
        });
        const reduceAvailableBalance = availableBalance - totalPrice;
        userData.availableBalance = reduceAvailableBalance;
        console.log("여기옴?")
        userData.portfolios.push(newPortfolio);
        console.log("여기옴?2")
        console.log(userData)
        const res1=await this.portfolioRepository.save(newPortfolio);
        console.log(res1)
        const res =await this.userRepository.save(userData);
        console.log(res)
      }
      const newUserData = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ['transactions', 'portfolios'],
      });
      console.log(newUserData)
      const portfolioData = await this.portfolioRepository.find({
        where: { user_id: user.id },
      });
      console.log(portfolioData)
      return newUserData;
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
    }catch(e){
      console.log(e)
    }
    return new HttpException('잘못된 요청입니다.', 400);

  }

  private async sellCoin(body: any, user: UserDataDto) {
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


