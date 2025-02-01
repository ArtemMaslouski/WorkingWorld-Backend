import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
export class UserDTO {

  @IsString()
  @IsNotEmpty()
  UserName: string;


  @ApiProperty({description: 'Пароль пользователя'})
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  Email: string;

  @ApiProperty({description: 'Пароль пользователя'})
  @IsString()
  @IsNotEmpty()
  Password: string;
}
