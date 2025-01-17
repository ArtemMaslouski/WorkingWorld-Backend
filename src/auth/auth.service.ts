import { Injectable } from '@nestjs/common';
import { UserDTO } from '../DTO/UserDTO';
import { ROLES }  from '../enums/roles.enums'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService ){}

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
}
