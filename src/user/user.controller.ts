import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: User, @Res() res: Response) {
    return this.userService.createUser(user, res);
  }

  @Post('/log-in')
  async login(@Body() user: User, @Res() res: Response) {
    return this.userService.login(user, res);
  }

  //TODO: AQUI PONER UN GUARRRRRRD
  @Get()
  async getUsers(@Res() res: Response) {
    return this.userService.getUser(res);
  }

  @Put('/block')
  async blockUser(
    @Res() res: Response,
    @Body() { userID }: { userID: number },
  ) {
    return this.userService.blockUser(res, userID);
  }

  @Get('/count')
  async getUserCount(@Res() res: Response) {
    return this.userService.getUserCount(res);
  }
}
