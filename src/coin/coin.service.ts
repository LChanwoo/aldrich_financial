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
import { DeleteTransactionDto } from './dto/deleteTransaction.dto';
import { roundToFiveDecimalPlaces } from '../../utils/roundToFiveDecimalPlaces';
import { roundToNineDecimalPlaces } from '../../utils/roundToNineDecimalPlaces';

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
      // console.log(userData)
      const balance = userData.balance;
      const availableBalance = userData.availableBalance;
      const portfolioData = userData.portfolios.map((portfolio) => {
          const currentPrice = JSON.parse(coinPrice[marketData.indexOf(portfolio.market)]).trade_price;
          const evaluatedPrice = roundToFiveDecimalPlaces(+(portfolio.quantity * currentPrice));
          console.log(portfolio.quantity)
          return {
            market: portfolio.market,
            quantity: portfolio.quantity,
            averagePrice: portfolio.averagePrice,
            totalInvested: portfolio.totalInvested,
            currentPrice: currentPrice,
            profitRate: ((1-portfolio.totalInvested/evaluatedPrice)*100).toFixed(2),
            evaluatedPrice: evaluatedPrice,
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
    if(body.amount*body.price<5000){
      throw new HttpException('최소 거래 금액은 5,000원 입니다.', 400);
    }
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
        const userData = await manager.findOne(User, {where:{ email: user.email },  relations: ['transactions', 'portfolios'] });
        const availableBalance = userData.availableBalance;
        const coinPrice = roundToFiveDecimalPlaces(+body.price);
        console.log('coinPrice', coinPrice);
        const coinAmount = roundToNineDecimalPlaces(+body.amount);
        console.log('coinAmount', coinAmount);
        const totalPrice = roundToFiveDecimalPlaces(coinPrice * coinAmount);
        console.log('totalPrice', totalPrice);
        if (totalPrice > availableBalance) {
          throw new BadRequestException('잔액이 부족합니다.');
        }
        userData.availableBalance = roundToFiveDecimalPlaces(+availableBalance - +totalPrice);
        const newTransaction = this.transactionRepository.create({
          user_id: user.id,
          market: body.coinName,
          quantity: +coinAmount,
          price: coinPrice,
          totalPrice: totalPrice,
          transactionType: '매수',
        });
        await manager.save(userData);
        await manager.save(newTransaction);
       })
      return { message: '매수 요청 성공' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async sellCoin(body: TransactionDto, user: UserDataDto) {
    try {
      await this.entityManager.transaction(async (manager) => {
        const userData = await this.entityManager.findOne(User, {where:{ email: user.email },  relations: ['transactions', 'portfolios'] });
        const coinPrice = +body.price;
        const coinAmount = +body.amount;
        const totalPrice = coinPrice * coinAmount;
        await this.entityManager.save(userData);
        const newTransaction = this.transactionRepository.create({
          user_id: user.id,
          market: body.coinName,
          quantity: coinAmount,
          price: coinPrice,
          totalPrice: totalPrice,
          transactionType: '매도',
        });
        await this.entityManager.save(newTransaction);
      });
      return { message: '매도 요청 성공' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async exclude_non_concluded_transcation(userData: UserDataDto){
     return await userData.transactions.filter((transaction) => transaction.doneAt === null); 
  }

  public async delete_non_concluded_transcation(body : DeleteTransactionDto ,userData: UserDataDto){
    const userInfo = await this.userRepository.findOne({
      where: { email: userData.email },
      relations: ['transactions', 'portfolios'],
    });
    console.log(userInfo)
    await this.entityManager.transaction(async (manager) => {
      const deleteTransaction = await manager.findOne(Transaction, {where:{ user_id: userData.id, id:body.transactionId, doneAt: null }});
      if(deleteTransaction){
        const user = await manager.update(User, {id:userData.id}, {availableBalance: +userInfo.availableBalance + +deleteTransaction.totalPrice})
        const res=await this.transactionRepository.delete({id:body.transactionId});
        console.log(res)
      }else {
        throw new BadRequestException('삭제할 수 없습니다.');
      }
    })
  }
}


