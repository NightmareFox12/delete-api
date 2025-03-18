import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll(): string {
    return 'This action returns all users';
  }

  @Post()
  async createUser(@Body() user: User, @Res() res: Response) {
    return this.userService.createUser(user, res);
  }
}
