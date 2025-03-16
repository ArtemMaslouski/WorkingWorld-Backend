import { Controller, Body, Get, Request, Post } from '@nestjs/common';
import { ChangePasswordDTO } from './DTO/change-password-DTO';
import { UserInfoService } from './user-info.service';
import * as cookieParser from 'cookie-parser';
import { AddPhoneNumberDTO } from './DTO/add-phone-number';
import { AddUserInfoDTO } from './DTO/add-user-info';

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

  @Post('add-phone-number')
  async addPhoneNumber(
    @Request() req,
    @Body() addPhoneNumberDTO: AddPhoneNumberDTO,
  ) {
    const token = req.cookies['access_token'];

    return this.userInfoService.addMobilePhone(token, addPhoneNumberDTO);
  }

  @Post('add-user-info')
  async addUserInfo(@Request() req, @Body() addUserInfoDTO: AddUserInfoDTO) {
    const token = req.cookies['access_token'];
    return this.userInfoService.addUserInfo(token, addUserInfoDTO);
  }
}
