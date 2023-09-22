import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../../entities/News.entity';
import { Repository } from 'typeorm';
import { CrawlingService } from './crawling.service';

@Injectable()
export class CrawlingScheduler {
  private readonly logger = new Logger(CrawlingScheduler.name);

  constructor(
    private readonly crawlingService: CrawlingService,
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,

  ) {}

  @Interval(60 * 1000) // 1시간마다 실행
  async handleCrawling() {
    try {
      const newsList = await this.crawlingService.crawlNews();
      await this.crawlingService.saveNews(newsList); 
    } catch (error) {
      this.logger.error('Crawling failed', error);
    }
  }
}
