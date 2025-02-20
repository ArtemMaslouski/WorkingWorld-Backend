import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerificateCodeFromEmailDTO {
    @ApiProperty({description: 'Верификационный код'})
    @IsString()
    @IsNotEmpty()
    Code: string;

    @ApiProperty({description: 'Электронная почта'})
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    Email: string;
}