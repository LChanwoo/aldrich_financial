import { CacheModule, Module } from '@nestjs/common';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from './gateway/event.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { Coin } from './entities/Coin.entity';
import { Transaction } from './entities/Transaction.entity';
import { Portfolio } from './entities/Portfolio.entity';
import { User } from './entities/User.entity';
import { AuthModule } from './auth/auth.module';
import { CoinModule } from './coin/coin.module';
import { TaskModule } from './task/task.module';
import { News } from './entities/News.entity';


@Module({
  imports: [
    EventModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RenderModule.forRootAsync(
      Next({
        dev: process.env.NODE_ENV !== 'production',
        conf: { useFilesystemPublicRoutes: true },
      }),
    ),
    TypeOrmModule.forRoot({
      type: 'mysql', // 데이터베이스 타입
      host: process.env.MYSQL_HOSTNAME, // 호스트 주소
      port: 3306, // 포트 번호
      username: 'root', // 사용자 이름
      password: process.env.MYSQL_ROOT_PASSWORD, // 사용자 비밀번호
      database: process.env.MYSQL_DATABASE, // 데이터베이스 이름
      entities: [User, Portfolio, Transaction, Coin, News], // 엔티티
      autoLoadEntities: true, // 엔티티 자동 로드 여부
      synchronize: true, // 스키마 자동 생성 여부
    }),
    UserModule,
    AuthModule,
    CoinModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  
}
