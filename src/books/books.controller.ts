import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { BooksService } from './books.service';
import { Request, Response } from 'express';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getBooks(@Res() res: Response) {
    return this.booksService.getBooks(res);
  }

  @Get('/like')
  async searchBooks(@Req() req: Request, @Res() res: Response) {
    return this.booksService.getBookLikes(req, res);
  }

  @Post('/like')
  async likeBook(@Req() req: Request, @Res() res: Response) {
    return this.booksService.likeBook(req, res);
  }

  //TODO: poner un guard
  @Get('/like-all')
  async getAllLikes(@Res() res: Response) {
    return this.booksService.getAllLikes(res);
  }
}
