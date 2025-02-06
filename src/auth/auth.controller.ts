import { Controller, Post, Body, Get, UseGuards, Param, Delete, Req, Res } from '@nestjs/common';
import { Request,Response } from 'express'
import { AuthService } from './auth.service';
import { UserDTO } from 'src/DTO/UserDTO';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  async createUser(@Body() userDTO: UserDTO) {
    return this.authService.registerUser(userDTO);
  }

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

  @Post('send') 
  async sendMail(@Body('Email') email: string) {
    return await this.authService.sendVerificationCodeToEmail(email)
  }

  @Post('forgotPassword')
  async forgotPassword(@Body('Code') code: string){
    return await this.authService.verificateUserWithCodeFromEmail(code)
  }

  @Post('resetPassword')
  async resetPassword(@Body('Email') email:string, @Body('Password') password: string ){
    return this.authService.resetPassword(email,password)
  }

}
