import { IsInt } from 'class-validator';

export class CreateChatDTO {
  @IsInt()
  userId1: number;

  @IsInt()
  userId2: number;
}
