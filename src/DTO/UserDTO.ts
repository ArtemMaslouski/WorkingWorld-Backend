import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
export class UserDTO {

  @IsString()
  @IsNotEmpty()
  UserName: string;

  @IsString()
  @IsNotEmpty()
  TelephoneNumber: string;

  @IsString()
  @IsNotEmpty()
  Password: string;

  
}
