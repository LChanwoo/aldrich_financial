import { RedisService } from '@liaoliaots/nestjs-redis';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { Connection, EntityManager, Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/login.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { TransactionDto } from './dto/transaction.dto';
import { Coin } from '../entities/Coin.entity';
import { Transaction } from '../entities/Transaction.entity';
import { Portfolio } from '../entities/Portfolio.entity';
import { UserDataDto } from '../user/dto/userData.dto';
import { ConnectedSocket } from '@nestjs/websockets';

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
    private readonly entityManager : EntityManager

  ) { }

  public async coinPrice(user : LoginDto) {
      const redisMarketData = await this.redisService.getClient().get("marketData")
      const marketData = redisMarketData!.toString().split(",")
      const coinPrice = await this.redisService.getClient().mget(marketData)
      const userData = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ['transactions', 'portfolios'],
      });
      const transactionData = userData.transactions.filter((transaction) => transaction.doneAt === null);
      console.log(userData)
      const balance = userData.balance;
      const availableBalance = userData.availableBalance;
      const portfolioData = userData.portfolios.map((portfolio) => {
        const currentPrice = JSON.parse(coinPrice[marketData.indexOf(portfolio.market)]).trade_price;
        return {
          market: portfolio.market,
          quantity: portfolio.quantity,
          averagePrice: portfolio.averagePrice,
          totalInvested: portfolio.totalInvested,
          currentPrice: currentPrice,
          profitRate: ((currentPrice - portfolio.averagePrice) / portfolio.averagePrice * 100).toFixed(2),
          evaluatedPrice: (portfolio.quantity * currentPrice).toFixed(8),
          evaluatedGainAndLoss: +((portfolio.quantity * currentPrice) - portfolio.totalInvested).toFixed(8),
        }
      })
      const totalPurchase = portfolioData.reduce((acc,cur)=> acc+ +cur.totalInvested,0)
      const totalEvaluated = portfolioData.reduce((acc,cur)=>acc+ +cur.evaluatedPrice,0)
      const totalGainAndLoss = totalEvaluated -totalPurchase
      let profitRate = +((1-totalPurchase/totalEvaluated)*100).toFixed(2)
      if(isNaN(profitRate)){
        profitRate = 0;
      }
      console.log(profitRate)
    return { 
      coinPrice,
      balance,
      availableBalance,
      transactionData,
      portfolioData,
      totalPurchase,
      totalEvaluated,
      totalGainAndLoss,
      profitRate

     };
  }

  public async deleteUserData(user: UserDataDto) {
    const userData = await this.userRepository.findOne({
      where: { email: user.email },
      relations: ['transactions', 'portfolios'],
    });
    await this.transactionRepository.delete({ user_id: userData.id });
    await this.portfolioRepository.delete({ user_id: userData.id });
    await this.userRepository.update({ id: userData.id }, { balance: 1000000, availableBalance: 1000000 });
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
  async purchaseCoin(body: TransactionDto, user: UserDataDto) {
    try {
      await this.entityManager.transaction(async (manager) => {
        // console.log('body', body);
        // 이전 데이터 삭제
        /* const deletePortfolio = await this.entityManager.findOneBy(Portfolio, { user_id: user.id, market: body.coinName });
        if (deletePortfolio) {
          const res = await this.entityManager.delete(Portfolio, { id: deletePortfolio.id });
          console.log(res);
        } */
        // 시작
        const userData = await this.entityManager.findOne(User, {where:{ email: user.email },  relations: ['transactions', 'portfolios'] });
        console.log("sssss", userData)
        // 이전 데이터 복구

        // const portfolioall = await this.entityManager.findBy(Portfolio, { user_id: userData.id });
        // console.log(portfolioall);

        const balance = userData.balance;
        const availableBalance = userData.availableBalance;
        // const coinData = JSON.parse(await this.redisService.getClient().get(body.coinName));
        const coinPrice = body.price;
        const coinAmount = body.amount;
        const totalPrice = coinPrice * coinAmount;
        if (totalPrice > availableBalance) {
          throw new BadRequestException('잔액이 부족합니다.');
        }
        const portfolio = userData.portfolios.find((portfolio) => portfolio.market === body.coinName);
        // if (portfolio) {
        //   portfolio.quantity += coinAmount;
        //   portfolio.totalInvested += totalPrice;
        //   portfolio.averagePrice = portfolio.totalInvested / portfolio.quantity;
          userData.availableBalance = availableBalance - totalPrice;

        //   await this.entityManager.save(portfolio);
        // } else {
        //   const newPortfolio = this.portfolioRepository.create({
        //     user_id: user.id,
        //     market: body.coinName,
        //     quantity: coinAmount,
        //     averagePrice: coinPrice,
        //     totalInvested: totalPrice,
        //   });
        //   const reduceAvailableBalance = availableBalance - totalPrice;
        //   userData.availableBalance = reduceAvailableBalance;
        //   userData.portfolios.push(newPortfolio);

        //   await this.entityManager.save(newPortfolio);
        // }
        await this.entityManager.save(userData);
        // const portfolioData = await this.entityManager.findBy(Portfolio, { user_id: user.id });
        const newTransaction = this.transactionRepository.create({
          user_id: user.id,
          market: body.coinName,
          quantity: coinAmount,
          price: coinPrice,
          totalPrice: totalPrice,
          transactionType: '매수',
        });
        await this.entityManager.save(newTransaction);
      });
      return { message: '매수 성공' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
 /*  private async purchaseCoin(body: TransactionDto, user: UserDataDto) {
    await this.entityManager.transaction(async manager =>{
    try{
      console.log("body",body)
      //이전 데이터 삭제
      const deletePortfolio = await this.portfolioRepository.findOne({
        where: { user_id: user.id, market: body.coinName },
      });
      if(deletePortfolio){
        const res=await this.portfolioRepository.delete({id:deletePortfolio.id});
        console.log(res)
      }
      // 시작
      const userData = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ['transactions', 'portfolios'],
      });
      // 이전 데이터 복구
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
        userData.portfolios.push(newPortfolio);
        const res1=await this.portfolioRepository.save(newPortfolio);
        const res =await this.userRepository.save(userData);
      }
      const newUserData = await this.userRepository.findOne({
        where: { email: user.email },
        relations: ['transactions', 'portfolios'],
      });

      const portfolioData = await this.portfolioRepository.find({
        where: { user_id: user.id },
      });
      console.log(portfolioData)
      // return newUserData;
      const newTransaction = this.transactionRepository.create({
        user_id: user.id,
        market: body.coinName,
        quantity: coinAmount,
        price: coinPrice,
        totalPrice: totalPrice,
        transactionType: '매수',
      });
      const res = await this.transactionRepository.save(newTransaction);

    }catch(e){
      console.log(e)
    }
    return new HttpException('잘못된 요청입니다.', 400);
  })
  } */

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


