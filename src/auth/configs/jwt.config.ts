import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get<string>('SECRET_KEY_ACCESS_TOKEN'),
    signOptions: {
        expiresIn: '30m'
    }
})