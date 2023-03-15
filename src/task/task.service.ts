import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, CronOptions } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { EntityManager, Repository } from 'typeorm';
import { Portfolio } from '../entities/Portfolio.entity';
import { Transaction } from '../entities/Transaction.entity';
import { ConnectedSocket } from '@nestjs/websockets';

interface CustomCronOptions extends CronOptions {
  concurrency?: number;
}


@Injectable()
export class TaskService {
  constructor(
    private readonly redis : RedisService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    private readonly entityManager: EntityManager,

  ) {}
  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    const transactionData = await this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .where('transaction.doneAt IS NULL')
      .getMany();
    console.log(transactionData)
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
              balance: user.balance - +transaction.quantity * currentPrice,
              availableBalance: user.availableBalance + (user.balance - +transaction.quantity * currentPrice - user.availableBalance),
            });
          await this.transactionRepository.update({ id: transaction.id }, { doneAt: new Date() });
        }
       console.log(await this.transactionRepository.find({
        where: { doneAt: null },
        relations: ['user'],
        }));
      }

      if (transaction.transactionType === '매도') {
      }

      })
    // console.log(transactionData)
    console.log('cron job is running every second');
    })
  }

}
