import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createTaskDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Название категории' })
  Category: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Название подкатегории' })
  Subcategory: string;

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
}
