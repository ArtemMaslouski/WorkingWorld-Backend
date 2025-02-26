import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createTaskDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Название задания' })
  Title: string;

  @IsString()
  @ApiProperty({ description: 'Адрес,нде надо выполнить задание' })
  Address?: string;

  @IsString()
  @ApiProperty({ description: 'Время начала задания' })
  BeginAt?: string;

  @IsString()
  @ApiProperty({ description: 'Время конца задания' })
  EndAt?: string;

  @IsString()
  @ApiProperty({ description: 'Описание задания' })
  Description?: string;

  @IsString()
  @ApiProperty({ description: 'Сумма за выполнение задания' })
  Cost?: string;
}
