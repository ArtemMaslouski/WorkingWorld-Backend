import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/DTO/UserDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  async createuser(@Body() userDTO: UserDTO) {
    return this.authService.registerUser(userDTO);
  }
}
