import { Controller, Get } from '@nestjs/common';
import { CrawlingService } from './crawling.service';

@Controller()
export class CrawlingController {

  constructor(
    private readonly crawlingService: CrawlingService,
  ) {}

  @Get('/api/news')
  async getNews() {
    const newsList = await this.crawlingService.getNewsList();
    return {news: newsList};
  }
}
