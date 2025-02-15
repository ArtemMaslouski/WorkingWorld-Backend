import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express'

export class RefreshJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException('Токен не найден')
        }

        try{
            const payload = await this.jwtService.verify(token,{
                secret: process.env.SECRET_KEY_REFRESH_TOKEN
            });

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException("Что-то пошло не так")
        }

        return true
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization.split(' ') ?? []

        return type === 'Bearer' ? token : undefined
    }

}