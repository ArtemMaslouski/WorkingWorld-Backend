import { Injectable, Res } from '@nestjs/common';
import { UserDTO } from '../DTO/UserDTO';
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express'
import { addMinutes } from 'date-fns'

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService, private jwtService: JwtService, private mailerService: MailerService  ){}

    async registerUser(userDTO: UserDTO ){
        const { UserName, Email ,Password } = userDTO;

        const hashedPassword = await bcrypt.hash(Password,10);
        
        return this.prisma.user.create({
            data: {
                UserName: UserName,
                Email: Email,
                Password: hashedPassword,

            }
        })
    }


    async login(email:string, password: string,@Res() res: Response) {
        const user = await this.prisma.user.findUnique({
            where: {
                Email: email
            }
        })

        if(!user) {
            throw new Error("Пользователя не существует");
        }

        const isValidPassword = await bcrypt.compare(password, user.Password);

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

    async deleteUser(id: number) {
        return await this.prisma.user.delete({
            where: {
                id: id
            }
        })
    }

    async sendVerificationCodeToEmail(email: string) {
        const code = Math.floor(10000 + Math.random() * 900000).toString()
        const hashedCode = await bcrypt.hash(code,10)

        await this.mailerService.sendMail({
            to: email,
            subject: 'Восстановление пароля',
            template: './src/auth/template/reset-password.ejs',
            context: {
                code,
            }
        })
        await this.prisma.user.update({
            where: {
                Email: email,
            },
            data: {
                ResetCode: hashedCode,
                ResetCodeExpires: addMinutes(new Date(), 15),
            }
        })

        return {
            message: "Сообщение отправлено успешно"
        }

    }

    async verificateUserWithCodeFromEmail(code:string,email: string) {

        const user = await this.prisma.user.findFirst({
            where: {
                Email: email,
            }
        })

        if(!user) {
            throw new Error("Кода не существует")
        }
        return await bcrypt.compare(code,user.ResetCode) ? true : false;
    }

    async resetPassword(email:string, password:string) {
       try{
            const hashedPassword = await bcrypt.hash(password,10)
            const updatedUser = await this.prisma.user.update({
                where: {
                    Email: email,
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

}
