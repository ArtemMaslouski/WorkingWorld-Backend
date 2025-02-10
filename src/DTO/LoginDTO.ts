import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @ApiProperty({description: 'Электронная почта'})
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    Email: string;

    @ApiProperty({description: 'Пароль пользователя'})
    @IsString()
    @IsNotEmpty()
    Password: string
}