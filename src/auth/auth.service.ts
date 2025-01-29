import { Injectable, Res } from '@nestjs/common';
import { UserDTO } from '../DTO/UserDTO';
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express'

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService, private jwtService: JwtService, private mailerService: MailerService  ){}

    async registerUser(userDTO: UserDTO ){
        const { UserName, TelephoneNumber ,Password } = userDTO;

        const hashedPassword = await bcrypt.hash(Password,10);
        
        return this.prisma.user.create({
            data: {
                UserName: UserName,
                TelephoneNumber: TelephoneNumber,
                Password: hashedPassword,

            }
        })
    }


    async login(userDTO: UserDTO,@Res() res: Response) {
        const { UserName, Password} = userDTO;
        const user = await this.prisma.user.findUnique({
            where: {
                UserName: UserName,
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

    async deleteUser(UserName: string) {
        return await this.prisma.user.delete({
            where: {
                UserName: UserName
            }
        })
    }
}
