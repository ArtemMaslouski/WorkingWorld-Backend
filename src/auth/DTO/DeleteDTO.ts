import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteDTO {
    @ApiProperty({description: 'Id удаляемого пользователя'})
    @IsNumber()
    id:number
}