import { Reflector } from "@nestjs/core";
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = RolesGuard.extractTokenFromHeaders(request);
        const user = await this.jwtService.decode(token);
        

        const requiredRole = this.reflector.getAllAndOverride('roles',[
            context.getHandler(),
            context.getClass(),
        ])

        if(!requiredRole) {
            return true;
        }

        return requiredRole.includes(user.Role) ? true : false;
    }

    static extractTokenFromHeaders(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined;
    }
}