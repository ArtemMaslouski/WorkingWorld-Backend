import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class ResetPassword {
    @ApiProperty({description: 'Электронная почта'})
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    Email: string

    @ApiProperty({description: 'Пароль пользователя'})
    @IsString()
    @IsNotEmpty()
    Password:string
}