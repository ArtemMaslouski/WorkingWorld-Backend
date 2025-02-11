import { Injectable, Res } from '@nestjs/common';
import { RegisterDTO } from '../DTO/RegisterDTO';
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express'
import { addMinutes } from 'date-fns'
import { Cron } from '@nestjs/schedule'
import { LoginDTO } from 'src/DTO/LoginDTO';
import { DeleteDTO } from 'src/DTO/DeleteDTO';
import { SendEmailDTO } from 'src/DTO/SendEmailDTO';
import { VerificateCodeFromEmailDTO } from '../DTO/VerificateCodeFromEmailDTO';
import { ResetPassword } from 'src/DTO/ResetPasswordDTO';

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService, private jwtService: JwtService, private mailerService: MailerService  ){}

    async registerUser(registerDTO: RegisterDTO ){
        const { UserName, Email ,Password } = registerDTO;

        const hashedPassword = await bcrypt.hash(Password,10);
        
        return this.prisma.user.create({
            data: {
                UserName: UserName,
                Email: Email,
                Password: hashedPassword,

            }
        })
    }


    async login(loginDTO: LoginDTO, @Res() res: Response) {
        const { Email, Password } = loginDTO
        const user = await this.prisma.user.findUnique({
            where: {
                Email: Email
            }
        })

        if(!user) {
            throw new Error("Пользователя не существует");
        }

        const isValidPassword = await bcrypt.compare(Password, user.Password);

        if(!isValidPassword) {
            throw new Error("Неверный пароль");
        }

        return this.createToken(user,res)
    }

    async createToken(user, @Res() res: Response) {
        const payload = { sub: user.id, UserName: user.UserName, TelephoneNumber: user.TelephoneNumber}
        
        const access_token = this.jwtService.sign(payload, {
            secret: process.env.SECRET_KEY_ACCESS_TOKEN,
            expiresIn: '30m'
        })
        

        res.cookie('access_token',access_token,{
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 30 * 60 * 100
        })

        const refresh_token = this.jwtService.sign(payload,{
            secret: process.env.SECRET_KEY_REFRESH_TOKEN,
            expiresIn: '30d',
        })

        res.cookie('refresh_token', refresh_token,{
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })


        return res.send({
            access_token: access_token,
            refresh_token: refresh_token,
        })
    }

    async getUsers() {
        return await this.prisma.user.findMany();
    }

    async deleteUser(deleteDTO: DeleteDTO) {
        const { id } = deleteDTO
        return await this.prisma.user.delete({
            where: {
                id: id
            }
        })
    }

    async sendVerificationCodeToEmail(sendEmailDTO: SendEmailDTO) {
        const { Email } = sendEmailDTO
        const code = Math.floor(10000 + Math.random() * 900000).toString()
        const hashedCode = await bcrypt.hash(code,10)

        await this.mailerService.sendMail({
            to: Email,
            from: process.env.EMAIL_LOGIN,
            subject: 'Восстановление пароля',
            template: './src/auth/template/reset-password.ejs',
            context: {
                code,
            }
        })
    
        const deleted = await this.prisma.user.update({
            where: {
                Email: Email,
            },
            data: {
                ResetCode: hashedCode,
                ResetCodeExpires: addMinutes(new Date(), 15),
            }
        })

        if(!deleted) {
            console.log("Удалять нечего")
        }

        return {
            message: "Сообщение отправлено успешно"
        }

    }

    async verificateUserWithCodeFromEmail(verificateDTO: VerificateCodeFromEmailDTO) {

        const { Code, Email } = verificateDTO
        const user = await this.prisma.user.findFirst({
            where: {
                Email: Email,
            }
        })

        if(!user) {
            throw new Error("Кода не существует")
        }
        return await bcrypt.compare(Code,user.ResetCode) ? true : false;
    }

    async resetPassword(resetPassword: ResetPassword) {
        const { Email, Password } = resetPassword
       try{
            const hashedPassword = await bcrypt.hash(Password,10)
            const updatedUser = await this.prisma.user.update({
                where: {
                    Email: Email,
                },
                data: {
                    Password: hashedPassword
                }
            })

            return updatedUser
       } catch{
        throw new Error("Ошибка изменения пароля")
       }
    }

    @Cron('*/5 * * * *')
    async resetCode() {
        const now = new Date()


        return this.prisma.user.updateMany({
            where: {
                ResetCodeExpires: {
                    lte: now
                }
            },
            data: {
                ResetCode: null,
                ResetCodeExpires:null
            }
        })
    }

}
