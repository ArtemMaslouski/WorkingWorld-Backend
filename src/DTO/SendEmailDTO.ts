import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'

export class SendEmailDTO {
    @ApiProperty({description: 'Электронная почта пользователя'})
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    Email: string
}