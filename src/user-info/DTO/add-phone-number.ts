import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddPhoneNumberDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Номер телефона пользователя' })
  PhoneNumber: string;
}
