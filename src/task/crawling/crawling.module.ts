import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../../entities/News.entity';
import { CrawlingController } from './crawling.controller';
import { CrawlingScheduler } from './crawling.scheduler';
import { CrawlingService } from './crawling.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([News]), 
  ],
  controllers: [CrawlingController],
  providers: [CrawlingService, CrawlingScheduler],
})
export class CrawlingModule {}
