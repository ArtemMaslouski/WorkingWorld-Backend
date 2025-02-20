import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
export class RegisterDTO {

  @ApiProperty({description: 'Имя пользователя'})
  @IsString()
  @IsNotEmpty()
  UserName: string;


  @ApiProperty({description: 'Электронная почта'})
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  Email: string;

  @ApiProperty({description: 'Пароль пользователя'})
  @IsString()
  @IsNotEmpty()
  Password: string;
}
