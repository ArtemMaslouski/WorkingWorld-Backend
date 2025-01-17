import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
export class UserDTO {
  @IsString()
  @IsNotEmpty()
  Login: string;

  @IsString()
  @IsNotEmpty()
  Password: string;

  @IsString()
  @IsNotEmpty()
  Role: string;
}
