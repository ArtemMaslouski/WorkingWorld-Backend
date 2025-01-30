import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
export class UserDTO {

  @IsString()
  @IsNotEmpty()
  UserName: string;


  @ApiProperty({description: 'Пароль пользователя'})
  @IsString()
  @IsNotEmpty()
  TelephoneNumber: string;

  @ApiProperty({description: 'Пароль пользователя'})
  @IsString()
  @IsNotEmpty()
  Password: string;
}
