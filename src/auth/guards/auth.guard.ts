import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeaders(request);

        if(!token) {
            throw new UnauthorizedException("Пользователь не авторизирован")
        }

        try{
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.SECRET_KEY,
            })
            request['user'] = payload;
        } catch {
            throw new Error('Что-то пошло не так')
        }

        return true
    }

    public extractTokenFromHeaders(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}