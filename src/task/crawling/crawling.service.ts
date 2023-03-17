// src/crawling.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { News } from '../../entities/News.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CrawlingService {
  constructor(@InjectRepository(News) private readonly newsRepository: Repository<News>) {}

  private readonly baseUrl = 'https://search.naver.com/search.naver';

  async crawlNews(): Promise<{ title: string; url: string, time: string }[]> {
    const response = await axios.get(this.baseUrl, {
      params: {
        where: 'news',
        query: '코인',
        sm: 'tab_opt',
        sort: '1',
      },
    });
    // console.log(response.data)
    const $ = cheerio.load(response.data);
    const newsItems = $('ul.list_news li');
    const newsList = [];

    newsItems.each((index, element) => {
      const title = $(element).find('a.news_tit').text();
      const url = $(element).find('a.news_tit').attr('href');
      const time = $(element).find('span.info').text();
      if (title ==='' || !url) return;
      newsList.push({ title, url, time});
    });

    return newsList;
  }

    async saveNews(newsList: { title: string; url: string; time: string }[]) {
      // 기존 뉴스 데이터를 모두 삭제합니다.
      await this.newsRepository.clear();

      // 새 뉴스 데이터를 생성합니다.
      const newsEntities = newsList.map((newsItem) => {
        const newsEntity = new News();
        newsEntity.title = newsItem.title;
        newsEntity.url = newsItem.url;
        newsEntity.time = newsItem.time;
        return newsEntity;
      });

      // 새 뉴스 데이터를 데이터베이스에 저장합니다.
      await this.newsRepository.save(newsEntities);
  }

  async getNewsList(): Promise<News[]> {
    return await this.newsRepository.find();
  }
}
