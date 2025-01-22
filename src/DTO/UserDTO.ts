import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { ROLES } from 'src/enums/roles.enums';
export class UserDTO {
  @ApiProperty({description: 'Логин пользователя'})
  @IsString()
  @IsNotEmpty()
  Login: string;

  @ApiProperty({description: 'Пароль пользователя'})
  @IsString()
  @IsNotEmpty()
  Password: string;

  Role: ROLES;
}
