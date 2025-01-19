import { Injectable } from '@nestjs/common';
import { UserDTO } from '../DTO/UserDTO';
import { ROLES }  from '../enums/roles.enums'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService, private jwtService: JwtService ){}

    async registerUser(userDTO: UserDTO ){
        const { Login, Password, Role = ROLES.USER} = userDTO;

        const hashedPassword = await bcrypt.hash(Password,10);
        
        return this.prisma.user.create({
            data: {
                Login,
                Password: hashedPassword,
                Role,
            }
        })
    }

    async registerEmployer(userDTO: UserDTO) {
        const { Login, Password, Role = ROLES.EMPLOYER} = userDTO;

        const hashedPassword = await bcrypt.hash(Password,10);

        return this.prisma.user.create({
            data: {
                Login,
                Password: hashedPassword,
                Role
            }
        })
    }

    async login(userDTO: UserDTO) {
        const { Login, Password, Role} = userDTO;
        const user = await this.prisma.user.findUnique({
            where: {
                Login: Login,
            }
        })

        if(!user) {
            throw new Error("Пользователя не существует");
        }

        const isValidPassword = await bcrypt.compare(Password, user.Password);

        if(!isValidPassword) {
            throw new Error("Неверный пароль");
        }


        return this.createToken(user)
    }

    async createToken(user) {
        const payload = { sub: user.id, Login: user.Login, Password: user.Password}

        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.SECRET_KEY_ACCESS_TOKEN,
                expiresIn: '30m',
            }),

            refresh_token: this.jwtService.sign(payload, {
                secret: process.env.SECRET_KEY_REFRESH_TOKEN,
                expiresIn: '30d',
            })
        }
    }
}
