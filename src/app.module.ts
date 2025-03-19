import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { NewsController } from './news/news.controller';
import { NewsService } from './news/news.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, BooksController, NewsController],
  providers: [AppService, UserService, BooksService, NewsService],
})
export class AppModule {}
