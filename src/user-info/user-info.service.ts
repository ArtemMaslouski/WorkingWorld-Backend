import { Injectable } from '@nestjs/common';
import { ChangePasswordDTO } from './DTO/change-password-DTO';
import { PrismaService } from 'src/prisma.service';
import { AddPhoneNumberDTO } from './DTO/add-phone-number';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AddUserInfoDTO } from './DTO/add-user-info';
import { AddDescription } from './DTO/add-description';

@Injectable()
export class UserInfoService {
  constructor(private prismaService: PrismaService) {}
  async changePassword(token: string, changePasswordDTO: ChangePasswordDTO) {
    try {
      const { OldPassword, Password, NewPassword } = changePasswordDTO;

      const { sub: userID } = this.verifyUser(token);

      const user = await this.prismaService.user.findFirst({
        where: {
          id: +userID,
        },
      });
      const hashedPassword = await bcrypt.hash(NewPassword, 10);

      const isValid = await bcrypt.compare(OldPassword, user.Password);

      if (isValid && Password === NewPassword) {
        return await this.prismaService.user.update({
          where: {
            id: +user.id,
          },
          data: {
            Password: hashedPassword,
          },
        });
      }
    } catch (error) {
      console.log(error);
      throw new Error('Не удалось изменить пароль');
    }
  }

  async getUserInfo(token: string) {
    const { sub: userID } = this.verifyUser(token);
    return await this.prismaService.user.findMany({
      where: {
        id: +userID,
      },
      include: {
        userInfo: true,
      },
    });
  }

  async addMobilePhone(token: string, addPhoneNumber: AddPhoneNumberDTO) {
    console.log(token);
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

  async addDescription(token: string, addDescription: AddDescription) {
    const { Description } = addDescription;
    const { sub: userID } = this.verifyUser(token);

    return this.prismaService.user.update({
      where: {
        id: +userID,
      },
      select: { userInfo: true },
      data: {
        userInfo: {
          update: {
            Description : Description,
          },
        },
      },
    });
  }

  async addUserInfo(token: string, addUserInfo: AddUserInfoDTO) {
    const { Name, Surname, BirthdayDate, Sex, City, Email } = addUserInfo;
    const { sub: userID } = this.verifyUser(token);

    return this.prismaService.user.update({
      where: { id: +userID },
      data: {
        userInfo: {
          upsert: {
            create: {
              Name,
              Surname,
              BirthdayDate,
              Sex,
              City,
              Email,
            },
            update: {
              Name,
              Surname,
              BirthdayDate,
              Sex,
              City,
              Email,
            },
          },
        },
      },
      include: {
        userInfo: true,
        Tasks: true,
      },
    });
  }

  public verifyUser(token: string) {
    return jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
  }
}
