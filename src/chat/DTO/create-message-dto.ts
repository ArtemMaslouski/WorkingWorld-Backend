import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDTO {
  @ApiProperty({ description: 'id Чата' })
  @IsInt()
  @IsNotEmpty()
  chatId: number;

  @ApiProperty({ description: 'Содержание сообщения' })
  @IsString()
  @IsNotEmpty()
  content: any;
}
