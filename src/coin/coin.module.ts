import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from '../entities/Coin.entity';
import { Portfolio } from '../entities/Portfolio.entity';
import { Transaction } from '../entities/Transaction.entity';
import { User } from '../entities/User.entity';

import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';

@Module({
  imports: [
    RedisModule.forRoot({
        config: {
          host: '0.0.0.0',
          port: 6379,
        }
      }),
    TypeOrmModule.forFeature([User, Coin, Portfolio, Transaction])

  ],
  controllers: [CoinController],
  providers: [CoinService]
})
export class CoinModule {}
