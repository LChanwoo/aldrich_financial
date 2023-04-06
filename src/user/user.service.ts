import { HttpException, Injectable } from '@nestjs/common';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { getColorByIndex } from '../../utils/getColorByIndex';
import { Coin } from '../entities/Coin.entity';
import { Transaction } from '../entities/Transaction.entity';
import { roundToFiveDecimalPlaces } from '../../utils/roundToFiveDecimalPlaces';

@Injectable()
export class UserService {
  constructor(
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly redis : RedisService
  ) {}

  public async getUsers() {
    return this.userRepository.find();
  }
  public async killUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    
    return this.userRepository.remove(user);
  }

  public async killAllUser() {
    try{
      await this.transactionRepository.delete({});
      await this.coinRepository.delete({});
      await this.userRepository.delete({});  
      return true;
    }catch(e){
      return console.log(e)
      
    }
    }

  public async createUser(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  public async give500millionUser(user: User) {
    const findUser = await this.userRepository.findOne({ where: { id: user.id } });
    findUser.balance = findUser.balance+500000000;
    findUser.availableBalance = findUser.availableBalance+500000000;
    return this.userRepository.save(findUser);
  }

  public async getUserData(userData: User) {
    const userInfo = await this.userRepository.findOne({
      where: { email: userData.email },
      relations: ['transactions', 'portfolios'],
    });
    if (userInfo) {
      console.log(userInfo.totalInvested); // 모든 포트폴리오의 totalInvested 합산 값
    }
    return userInfo;
  }   
  
  public async getRanking() {
    const ranking = await this.userRepository.find({relations: ['transactions', 'portfolios'],});
    const sorted = ranking.sort((a, b) => {
      if(+a.totalScore !== +b.totalScore){
        return +b.totalScore - +a.totalScore;
      }
      if(+a.totalInvested !== +b.totalInvested){
        return +b.totalInvested - +a.totalInvested;
      }
      if(+a.balance !== +b.balance){
        return +b.balance - +a.balance;
      }
      return 0;
    });
    const map = sorted.map((user, index) => user.toObject()).slice(0, 10);

    return map;
  }

  public async getPortfolioChartData(user: User) {
    const userInfo = await this.userRepository.findOne({
      where: { email: user.email },
      relations: ['transactions', 'portfolios'],
    });
    if (userInfo) {
      const redisMarketData = await this.redis.getClient().get("marketData")
      const marketData = redisMarketData!.toString().split(",")
      const coinPrice = await this.redis.getClient().mget(marketData)
      const portfolioData = userInfo.portfolios.map((portfolio) => {
          const currentPrice = JSON.parse(coinPrice[marketData.indexOf(portfolio.market)]).trade_price;
          const evaluatedPrice = roundToFiveDecimalPlaces(+(portfolio.quantity * currentPrice));
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
      if(userInfo.portfolios.length === 0){
        return [];
      }
      const currentPricesPromises = userInfo.portfolios.map(async (portfolio) => {
        const res = await this.redis.getClient().get(portfolio.market)
        return {
          market: portfolio.market,
          price:JSON.parse(res).trade_price * portfolio.quantity}
      })
      const currentPrices = await Promise.all(currentPricesPromises);
      currentPrices.sort((a, b) => b.price - a.price);
      const totalEvaluated = currentPrices.reduce((acc, cur) => acc + +cur.price, 0);
      let backgroundColor = [];
      let chartLegends = [];
      let chartPercentage = currentPrices.map((data,index) =>{ 
        if(index >= 9){
          return 0;
        }
        backgroundColor.push(getColorByIndex(index));
        chartLegends.push({title:data.market.replace('KRW-',''), color:getColorByIndex(index) });
        return Math.round(data.price / totalEvaluated * 10000)/100
      });
    
      if(userInfo.portfolios.length === 0){
        return [];
      }
      if(userInfo.portfolios.length >= 10){
        chartPercentage[9] = 100 - chartPercentage.slice(0, 9).reduce((acc, cur) => acc + cur, 0);
        backgroundColor[9] = getColorByIndex(9);
        chartLegends[9] = {title:'기타', color:getColorByIndex(9) };
      }
      const now = new Date();
      // YYYY-MM-DD hh:mm:ss로 변환
      const nowDate = now.toISOString().substr(0, 10);
      const chartData = {
        chartLegends,
        chartPercentage,
        backgroundColor,
        portfolioData,
        nowDate,
      };
      return chartData;
    }
    return new HttpException('User not found', 404);
  }

}
