import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class AddUserInfo {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Имя пользователя' })
  Name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Фамилия пользователя' })
  Surname: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'Дата рождения' })
  BirthdayDay: Date;

  @IsNotEmpty()
  @ApiProperty({ description: 'Пол пользователяы' })
  Sex: Gender;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Город пользователя' })
  City: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Электронная почта пользователя' })
  Email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Номер телефона пользователя' })
  PhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Пароль пользователя' })
  Password: string;
}
