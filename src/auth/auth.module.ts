import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter} from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port:  process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_LOGIN,
          pass: process.env.EMAIL_PASSWORD,
        }
      },
      template: {
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        }
      }
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET_KEY_ACCESS_TOKEN'),
        signOptions: {
          expiresIn: '30m'
        },
      }),

      inject: [ConfigService]

    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
