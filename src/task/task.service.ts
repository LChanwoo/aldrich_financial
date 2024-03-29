import { InjectRedis, RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, CronOptions, Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { EntityManager, Repository } from 'typeorm';
import { Portfolio } from '../entities/Portfolio.entity';
import { Transaction } from '../entities/Transaction.entity';
import { ConnectedSocket } from '@nestjs/websockets';
import axios from "axios"
import { Redis } from 'ioredis';
interface CustomCronOptions extends CronOptions {
  concurrency?: number;
}


@Injectable()
export class TaskService {
  
  logger = new Logger(TaskService.name);

  constructor(
    private readonly redis : RedisService,
    @InjectRedis() private readonly redis2: Redis,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    private readonly entityManager: EntityManager,

  ) {}
  // @Cron(CronExpression.EVERY_SECOND)
  @Interval(500)
  async handleCron() {
    const transactionData = await this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .where('transaction.doneAt IS NULL')
      .getMany();
    transactionData.forEach(async (transaction) => {
      const currentPrice = JSON.parse(await this.redis.getClient().get(transaction.market)).trade_price;
      await this.entityManager.transaction(async (transactionManager) => {
      if (transaction.transactionType === '매수') {
        if(transaction.price >= currentPrice) {
          const user = await this.userRepository.findOne({
            where: { id: transaction.user_id },
            relations: ['portfolios'],
          });
          const portfolio = user.portfolios.find((portfolio) => portfolio.market === transaction.market);
          if (portfolio) {
            await this.portfolioRepository.update({ id: portfolio.id }, {
              quantity: Number(portfolio.quantity) + Number(transaction.quantity),
              averagePrice: (Number(portfolio.averagePrice) * Number(portfolio.quantity) + Number(transaction.quantity) * currentPrice) / (+portfolio.quantity + Number(transaction.quantity)),
              totalInvested: +portfolio.totalInvested + Number(transaction.quantity) * +currentPrice,
            });
          } else {
            await this.portfolioRepository.save({
              user_id: transaction.user_id,
              market: transaction.market,
              quantity: Number(transaction.quantity),
              averagePrice: Number(currentPrice),
              totalInvested: Number(transaction.quantity) * Number(currentPrice),
            });
          }
          await this.userRepository.update({ id: transaction.user_id }, 
            {
              balance: +user.balance - +transaction.quantity * +currentPrice,
              availableBalance: +user.availableBalance + (+user.balance - +transaction.quantity * currentPrice - +user.availableBalance),
            });
          await this.transactionRepository.update({ id: transaction.id }, { doneAt: new Date() });
          this.logger.log(`${user.email}님의 ${transaction.market} 매수가 완료되었습니다.(거래가격: ${currentPrice}, 거래수량: ${transaction.quantity})`);
        }
      }

      if (transaction.transactionType === '매도') {
        
        if(transaction.price <= currentPrice) {
          const user = await this.userRepository.findOne({
            where: { id: transaction.user_id },
            relations: ['portfolios'],
          });
          const portfolio = user.portfolios.find((portfolio) => portfolio.market === transaction.market);
          if (portfolio) {
            let averagePrice = (Number(portfolio.averagePrice) * Number(portfolio.quantity) - Number(transaction.quantity) * currentPrice) / (+portfolio.quantity - Number(transaction.quantity));
            let quantity = Number(portfolio.quantity) - Number(transaction.quantity);
            if(+portfolio.quantity - Number(transaction.quantity)===0){
              averagePrice = 0;
            }
            if(quantity<=0){
              await this.portfolioRepository.delete({ id: portfolio.id });
            } else {
              await this.portfolioRepository.update({ id: portfolio.id }, {
                quantity: Number(portfolio.quantity) - Number(transaction.quantity),
                averagePrice: +averagePrice,
                totalInvested: +portfolio.totalInvested - Number(transaction.quantity) * +currentPrice,
          });
            }
          } else {
            await this.portfolioRepository.save({
              user_id: transaction.user_id,
              market: transaction.market,
              quantity: Number(transaction.quantity),
              averagePrice: Number(currentPrice),
              totalInvested: Number(transaction.quantity) * Number(currentPrice),
            });
          }
          await this.userRepository.update({ id: transaction.user_id }, 
            {
              balance: +user.balance + +transaction.quantity * currentPrice,
              availableBalance: +user.availableBalance + (+user.balance + +transaction.quantity * currentPrice - +user.availableBalance),
            });
          await this.transactionRepository.update({ id: transaction.id }, { doneAt: new Date() });
          this.logger.log(`${user.email}님의 ${transaction.market} 매도가 완료되었습니다.(거래가격: ${currentPrice}, 거래수량: ${transaction.quantity})`);
        }
      }
      })
    })
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async getMarketData() {
    const market = await axios.get('https://api.upbit.com/v1/market/all')
    const marketData = await market.data.map((item:any)=>item.market).filter((item:any)=>item.includes('KRW'))
    await this.redis2.set("marketData",marketData.toString())
  }

}
