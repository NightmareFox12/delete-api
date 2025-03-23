import { Body, Controller, Post, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { Admin } from 'src/entity/Admin.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Post()
  // async createAdmin(@Body() admin: Admin, @Res() res: Response) {
  //   return this.adminService.createAdmin(admin, res);
  // }

  @Post()
  async isAdmin(@Body() admin: Admin, @Res() res: Response) {
    return this.adminService.isAdmin(admin, res);
  }
}
