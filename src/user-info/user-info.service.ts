import { Injectable } from '@nestjs/common';
import { ChangePasswordDTO } from './DTO/change-password-DTO';
import { PrismaService } from 'src/prisma.service';
import { AddPhoneNumberDTO } from './DTO/add-phone-number';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AddUserInfoDTO } from './DTO/add-user-info';

@Injectable()
export class UserInfoService {
  constructor(private prismaService: PrismaService) {}
  async changePassword(token: string, changePasswordDTO: ChangePasswordDTO) {
    try {
      const { OldPassword, Password, NewPassword } = changePasswordDTO;

      const user = await this.verifyUser(token);
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
    return await this.prismaService.user.findMany({
      include: {
        userInfo: true,
      },
    });
  }

  async addMobilePhone(token: string, addPhoneNumber: AddPhoneNumberDTO) {
    const { PhoneNumber } = addPhoneNumber;
    const { sub: userID } = this.verifyUser(token);

    return this.prismaService.user.update({
      where: {
        id: +userID,
      },
      select: { userInfo: true },
      data: {
        userInfo: {
          update: {
            PhoneNumber: PhoneNumber,
          },
        },
      },
    });
  }

  async addUserInfo(token: string, addUserInfo: AddUserInfoDTO) {
    const { Name, Surname, BirthdayDate, Sex, City, Email } = addUserInfo;
    const { sub: userID } = this.verifyUser(token);

    return this.prismaService.user.update({
      where: {
        id: +userID,
      },
      select: { userInfo: true },
      data: {
        userInfo: {
          update: {
            Name,
            Surname,
            BirthdayDate: BirthdayDate ? new Date(BirthdayDate) : undefined,
            Sex,
            City,
            Email,
          },
        },
      },
    });
  }

  verifyUser(token: string) {
    return jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
  }
}
