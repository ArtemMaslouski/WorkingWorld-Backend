import {
  Controller,
  Body,
  Get,
  Request,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ChangePasswordDTO } from './DTO/change-password-DTO';
import { UserInfoService } from './user-info.service';
import { AddPhoneNumberDTO } from './DTO/add-phone-number';
import { AddUserInfoDTO } from './DTO/add-user-info';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponses } from 'src/auth/configs/swagger-responses.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './uploadFile.service';

@ApiTags('Profile Info')
@Controller('user-info')
export class UserInfoController {
  constructor(
    private userInfoService: UserInfoService,
    private uploadAvatarService: UploadService,
  ) {}
  @ApiOperation({
    summary: 'Изменения пароля на странице профиля',
    description:
      'Функция позволяет изменить пароль на странице профиля пользователя',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDTO: ChangePasswordDTO,
  ) {
    const token = req.cookies['access_token'];

    return this.userInfoService.changePassword(token, changePasswordDTO);
  }

  @Get('get-info')
  async getUserInfo(@Request() req) {
    const token = req.cookies['access_token'];
    return this.userInfoService.getUserInfo(token);
  }

  @ApiOperation({
    summary: 'Добавить мобильный номер телефона на странице профиля',
    description:
      'Функция позволяет добавить номер телефона на странице профиля пользователя',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('add-phone-number')
  async addPhoneNumber(
    @Request() req,
    @Body() addPhoneNumberDTO: AddPhoneNumberDTO,
  ) {
    const token = req.cookies['access_token'];

    return this.userInfoService.addMobilePhone(token, addPhoneNumberDTO);
  }

  @ApiOperation({
    summary: 'Добавить дополнительную ифнормацию на странице профиля',
    description:
      'Функция позволяет добавить дополнительную информацию о пользователе на странице профиля (Имя,Фамилия,Дата Рождения,Пол,Город,Электроная почта)',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('add-user-info')
  async addUserInfo(@Request() req, @Body() addUserInfoDTO: AddUserInfoDTO) {
    const token = req.cookies['access_token'];
    return this.userInfoService.addUserInfo(token, addUserInfoDTO);
  }

  @ApiOperation({
    summary: 'Загрузка аватара пользователя',
    description: 'Функция позволяет загрузить изорбражение пользователя',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const token = req.cookies['access_token'];
    const filePath = await this.uploadAvatarService.uploadFile(file, token);
    return { imageUrl: filePath };
  }
}
