import { Controller, Post, Body, Get, UseGuards, Param, Delete, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request,Response } from 'express'
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/DTO/RegisterDTO';
import { LoginDTO } from 'src/DTO/LoginDTO'
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { DeleteDTO } from 'src/DTO/DeleteDTO';
import { SendEmailDTO } from 'src/DTO/SendEmailDTO';
import { VerificateCodeFromEmailDTO } from 'src/DTO/VerificateCodeFromEmailDTO';
import { ResetPassword } from 'src/DTO/ResetPasswordDTO';
import { RefreshJwtGuard } from './guards/refreshJwt.guard';
import { SwaggerResponses } from './configs/swagger-responses.config';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Создание пользователя',
    description: 'Функция создает пользователя используя имя пользователя, электронную почту и пароль'
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
    description: 'Функция позволяет пользователю зайти в аккаунт используя имя пользователя и пароль'
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('login')
  async login(@Body() loginDTO: LoginDTO,@Res() res: Response) {
    return this.authService.login(loginDTO, res);
  }

  @ApiTags('test')
  @Get('test')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
   test() {
    return 'Hello World'
  }

  @Get('get-users')
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  async getUsers() {
    return this.authService.getUsers()
  }

  @ApiOperation({
    summary: 'Удаление аккаунта',
    description: 'Функция позволяет удалить аккаунт по логину(возможно позже будем удалять по токену)'
  })
  @ApiResponse(SwaggerResponses.ok)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Delete('delete-users')
  async deleteUsers(@Body() deleteDTO: DeleteDTO) {
    return this.authService.deleteUser(deleteDTO)
  }

  @ApiOperation({
    summary: 'Отправка кода подтверждения на почту',
    description: 'Функция позволяет отправить код подтверждения на почту,если пользователь забыл пароль'
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('send') 
  async sendMail(@Body() sendEmailDTO: SendEmailDTO) {
    return await this.authService.sendVerificationCodeToEmail(sendEmailDTO)
  }

  @ApiOperation({
    summary: 'Проверка кода,высланного на почту'
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @Post('forgotPassword')
  async forgotPassword(@Body() verificateDTO: VerificateCodeFromEmailDTO){
    return await this.authService.verificateUserWithCodeFromEmail(verificateDTO)
  }

  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @ApiOperation({
    summary: 'Восстановление пароля',
    description: 'Функция позволяет создать новый пароль, вместо старого забытого'
  })
  @Post('resetPassword')
  async resetPassword(@Body() resetPassword: ResetPassword){
    return this.authService.resetPassword(resetPassword)
  }

  @ApiOperation({
    summary: 'Обновить токены',
    description: 'Получения нового токена на основе старого refresh токена,когда access Token протух'
  })
  @ApiResponse(SwaggerResponses.created)
  @ApiResponse(SwaggerResponses.badRequest)
  @ApiResponse(SwaggerResponses.serverError)
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    if(!user){
      throw new UnauthorizedException()
    }
    return this.authService.createToken(user,res)
  }
}
 