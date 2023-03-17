import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../../entities/News.entity';
import { CrawlingController } from './crawling.controller';
import { CrawlingScheduler } from './crawling.scheduler';
import { CrawlingService } from './crawling.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // 스케줄러 모듈을 등록합니다.
    TypeOrmModule.forFeature([News]), // 데이터베이스 모듈을 등록합니다.
  ],
  controllers: [CrawlingController], // 컨트롤러를 등록합니다.
  providers: [CrawlingService, CrawlingScheduler], // 서비스와 스케줄러를 등록합니다.
})
export class CrawlingModule {}
