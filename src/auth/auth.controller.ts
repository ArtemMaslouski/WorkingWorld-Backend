import { Controller, Post, Body, Get, UseGuards, Param, Delete, Req, Res } from '@nestjs/common';
import { Request,Response } from 'express'
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/DTO/RegisterDTO';
import { LoginDTO } from 'src/DTO/LoginDTO'
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteDTO } from 'src/DTO/DeleteDTO';
import { SendEmailDTO } from 'src/DTO/SendEmailDTO';
import { VerificateCodeFromEmailDTO } from 'src/DTO/VerificateCodeFromEmailDTO';
import { ResetPassword } from 'src/DTO/ResetPasswordDTO';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Создание пользователя',
    description: 'Функция создает пользователя используя имя пользователя, электронную почту и пароль'
  })
  @Post('create-user')
  async createUser(@Body() registerDTO: RegisterDTO) {
    return this.authService.registerUser(registerDTO);
  }

  @ApiOperation({
    summary: 'Зайти в аккаунт',
    description: 'Функция позволяет пользователю зайти в аккаунт используя имя пользователя и пароль'
  })
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
  async getUsers() {
    return this.authService.getUsers()
  }

  @ApiOperation({
    summary: 'Удаление аккаунта',
    description: 'Функция позволяет удалить аккаунт по логину(возможно позже будем удалять по токену)'
  })
  @Delete('delete-users')
  async deleteUsers(@Body() deleteDTO: DeleteDTO) {
    return this.authService.deleteUser(deleteDTO)
  }

  @Get('set-cookie')
  setCookie(@Res({ passthrough:true }) response: Response) {
    response.cookie('key','value');
  }
  @Get('get-cookie')
  getCookie(@Req() request: Request) {
    console.log(request.cookies)
  }

  @ApiOperation({
    summary: 'Отправка кода подтверждения на почту',
    description: 'Функция позволяет отправить код подтверждения на почту,если пользователь забыл пароль'
  })
  @Post('send') 
  async sendMail(@Body() sendEmailDTO: SendEmailDTO) {
    return await this.authService.sendVerificationCodeToEmail(sendEmailDTO)
  }

  @ApiOperation({
    summary: 'Проверка кода,высланного на почту'
  })
  @Post('forgotPassword')
  async forgotPassword(@Body() verificateDTO: VerificateCodeFromEmailDTO){
    return await this.authService.verificateUserWithCodeFromEmail(verificateDTO)
  }

  @ApiOperation({
    summary: 'Восстановление пароля',
    description: 'Функция позволяет создать новый пароль, вместо старого забытого'
  })
  @Post('resetPassword')
  async resetPassword(@Body() resetPassword: ResetPassword){
    return this.authService.resetPassword(resetPassword)
  }

}
 