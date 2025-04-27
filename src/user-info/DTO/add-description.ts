import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddDescription {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Описание пользователя' })
  Description: string;
}
