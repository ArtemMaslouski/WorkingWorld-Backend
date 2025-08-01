import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDTO {
  @ApiProperty({ description: ' Id первого пользователя' })
  @IsNumber()
  userId1: number;

  @ApiProperty({ description: 'Id второго пользователя' })
  @IsNumber()
  userId2: number;
}
