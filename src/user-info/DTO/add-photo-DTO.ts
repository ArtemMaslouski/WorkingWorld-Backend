import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPhotoDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'id Пользователя' })
  id: number;
}
