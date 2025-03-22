import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { NewsController } from './news/news.controller';
import { NewsService } from './news/news.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [
    AppController,
    UserController,
    BooksController,
    NewsController,
    AdminController,
  ],
  providers: [AppService, UserService, BooksService, NewsService, AdminService],
})
export class AppModule {}
