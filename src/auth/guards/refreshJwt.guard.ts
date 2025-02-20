import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from "./roles.guard";

@Injectable()
export class RefreshJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = RolesGuard.extractTokenFromHeaders(request)

        if(!token) {
            throw new Error("Токен отсутствует")
        }

        try{
            const payload = this.jwtService.verify(token,{
                secret: process.env.SECRET_KEY_REFRESH_TOKEN
            })
            request['user'] = payload

        } catch(error){
            console.log(error)
        }

        return true;
    }
}