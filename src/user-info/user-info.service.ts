import { Injectable } from '@nestjs/common';
import { ChangePasswordDTO } from './DTO/change-password-DTO';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserInfoService {
  constructor(private prismaService: PrismaService) {}
  async changePassword(token: string, changePasswordDTO: ChangePasswordDTO) {
    try {
      const { OldPassword, Password, NewPassword } = changePasswordDTO;

      const user = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
      const hashedPassword = await bcrypt.hash(NewPassword, 10);
      console.log(user);

      //const isValid = await bcrypt.compare(OldPassword, user.Password);

      if (Password !== NewPassword) {
        throw new Error('Пароли не совпадают');
      }

      return await this.prismaService.user.update({
        where: {
          id: +user.sub,
        },
        data: {
          Password: hashedPassword,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error('Не удалось изменить пароль');
    }
  }

  async getUserInfo() {
    return await this.prismaService.userInfo.findMany();
  }

  async;
}
