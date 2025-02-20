import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { strict } from "assert";

export const mailConfig = async (configService: ConfigService): Promise<MailerOptions> => ({
    transport: {
        host: configService.get<string>('SMTP_HOST'),
        port: configService.get<number>('SMTP_PORT'),
        secure: false,
        auth: {
            user: configService.get<string>('EMAIL_LOGIN'),
            pass: configService.get<string>('EMAIL_PASSWORD'),

        },
    },

    template: {
        adapter: new EjsAdapter(),
        options: {
            strict: false,
        }
    }
})