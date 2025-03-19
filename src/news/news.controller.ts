import { Controller, Get, Res } from '@nestjs/common';
import { NewsService } from './news.service';
import { Response } from 'express';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Get()
  async getNews(@Res() res: Response) {
    return this.newsService.getNews(res);
  }
}
