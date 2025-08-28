import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Delete,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/auth/DTO/RegisterDTO';
import { LoginDTO } from 'src/auth/DTO/LoginDTO';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { DeleteDTO } from 'src/auth/DTO/DeleteDTO';
import { SendEmailDTO } from 'src/auth/DTO/SendEmailDTO';
import { VerificateCodeFromEmailDTO } from 'src/auth/DTO/VerificateCodeFromEmailDTO';
import { ResetPassword } from 'src/auth/DTO/ResetPasswordDTO';
import { RefreshJwtGuard } from './guards/refreshJwt.guard';
import { SwaggerResponses } from './configs/swagger-responses.config';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Создание пользователя',
    description:
      'Функция создает пользователя используя имя пользователя, электронную почту и пароль',
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('create-user')
  async createUser(@Body() registerDTO: RegisterDTO) {
    return this.authService.registerUser(registerDTO);
  }

  @ApiOperation({
    summary: 'Зайти в аккаунт',
    description:
      'Функция позволяет пользователю зайти в аккаунт используя имя пользователя и пароль',
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.login(loginDTO, req, res);
  }

  @Get('get-users')
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  async getUsers() {
    return this.authService.getUsers();
  }

  @ApiOperation({
    summary: 'Удаление аккаунта',
    description:
      'Функция позволяет удалить аккаунт по логину(возможно позже будем удалять по токену)',
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Delete('delete-users')
  async deleteUsers(@Req() req) {
    const token = req.cookies['access_token'];
    return this.authService.deleteUser(token);
  }

  @ApiOperation({
    summary: 'Отправка кода подтверждения на почту',
    description:
      'Функция позволяет отправить код подтверждения на почту,если пользователь забыл пароль',
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @ApiResponse(SwaggerResponses.badRequest)
  @Post('send')
  async sendMail(@Body() sendEmailDTO: SendEmailDTO) {
    return await this.authService.sendVerificationCodeToEmail(sendEmailDTO);
  }

  @ApiOperation({
    summary: 'Проверка кода,высланного на почту',
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('forgotPassword')
  async forgotPassword(@Body() verificateDTO: VerificateCodeFromEmailDTO) {
    return await this.authService.verificateUserWithCodeFromEmail(
      verificateDTO,
    );
  }

  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @ApiOperation({
    summary: 'Восстановление пароля',
    description:
      'Функция позволяет создать новый пароль, вместо старого забытого',
  })
  @Post('resetPassword')
  async resetPassword(@Body() resetPassword: ResetPassword) {
    return this.authService.resetPassword(resetPassword);
  }

  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @ApiOperation({
    summary: 'Получить токен',
    description: 'Функиция позволяет получить access_token из куки',
  })
  @Get('getToken')
  async getToken(@Req() req: Request) {
    return this.authService.getTokenFromCookies(req);
  }

  @ApiOperation({
    summary: 'Обновить токены',
    description:
      'Получения нового токена на основе старого refresh токена,когда access Token протух',
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res);
  }
}
