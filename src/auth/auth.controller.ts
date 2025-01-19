import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/DTO/UserDTO';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  async createUser(@Body() userDTO: UserDTO) {
    return this.authService.registerUser(userDTO);
  }

  @Post('create-employer')
  async createEmployer(@Body() userDTO: UserDTO) {
    return this.authService.registerEmployer(userDTO);
  }

  @Post('login')
  async login(@Body() userDTO: UserDTO) {
    return this.authService.login(userDTO);
  }

  @UseGuards(AuthGuard)
  @Get('test')
  async test() {
    return 'Hello World'
  }
}
