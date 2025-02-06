import { Controller, Post, Body, Get, UseGuards, Param, Delete, Req, Res } from '@nestjs/common';
import { Request,Response } from 'express'
import { AuthService } from './auth.service';
import { UserDTO } from 'src/DTO/UserDTO';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Создание пользователя',
    description: 'Функция создает пользователя используя имя пользователя, электронную почту и пароль'
  })
  @Post('create-user')
  async createUser(@Body() userDTO: UserDTO) {
    return this.authService.registerUser(userDTO);
  }

  @ApiOperation({
    summary: 'Зайти в аккаунт',
    description: 'Функция позволяет пользователю зайти в аккаунт используя имя пользователя и пароль'
  })
  @Post('login')
  async login(@Body() userDTO: UserDTO,@Res() res: Response) {
    return this.authService.login(userDTO,res);
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
  async deleteUsers(@Body('Login') Login: string) {
    return this.authService.deleteUser(Login)
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
  async sendMail(@Body('Email') email: string) {
    return await this.authService.sendVerificationCodeToEmail(email)
  }

  @ApiOperation({
    summary: 'Проверка кода,высланного на почту'
  })
  @Post('forgotPassword')
  async forgotPassword(@Body('Code') code: string){
    return await this.authService.verificateUserWithCodeFromEmail(code)
  }

  @ApiOperation({
    summary: 'Восстановление пароля',
    description: 'Функция позволяет создать новый пароль, вместо старого забытого'
  })
  @Post('resetPassword')
  async resetPassword(@Body('Email') email:string, @Body('Password') password: string ){
    return this.authService.resetPassword(email,password)
  }

}
 