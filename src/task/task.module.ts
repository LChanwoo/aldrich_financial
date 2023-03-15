import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CoinModule } from '../coin/coin.module';
import { TaskService } from './task.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CoinModule
  ],
  providers: [TaskService]
})
export class TaskModule {}
