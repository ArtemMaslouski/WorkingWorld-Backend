import { Controller, Body, Get, Request, Post } from '@nestjs/common';
import { ChangePasswordDTO } from './DTO/change-password-DTO';
import { UserInfoService } from './user-info.service';
import * as cookieParser from 'cookie-parser';

@Controller('user-info')
export class UserInfoController {
  constructor(private userInfoService: UserInfoService) {}
  @Post('test')
  async changePassword(
    @Request() req,
    @Body() changePasswordDTO: ChangePasswordDTO,
  ) {
    const token = req.cookies['access_token'];

    return this.userInfoService.changePassword(token, changePasswordDTO);
  }

  @Get('get-info')
  async getUserInfo() {
    return this.userInfoService.getUserInfo();
  }
}
