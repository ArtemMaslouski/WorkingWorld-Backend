import { IsNotEmpty, IsNumber } from 'class-validator';

export class deleteTaskDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
