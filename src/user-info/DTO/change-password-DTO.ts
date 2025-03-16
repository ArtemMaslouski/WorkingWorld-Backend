import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Старый пароль' })
  OldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Текуший пароль пользователя' })
  Password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Новый пароль' })
  NewPassword: string;
}
