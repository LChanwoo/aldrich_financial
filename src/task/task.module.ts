import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CoinModule } from '../coin/coin.module';
import { TaskService } from './task.service';
import { CrawlingModule } from './crawling/crawling.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CoinModule,
    CrawlingModule
  ],
  providers: [TaskService]
})
export class TaskModule {}
