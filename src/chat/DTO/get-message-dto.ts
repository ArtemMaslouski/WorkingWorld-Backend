import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
export class GetMessageDTO {
  @ApiProperty({
    description: 'Id чата из которого вы хотите получить сообшения',
  })
  @IsNumber()
  chatId: number;
}
