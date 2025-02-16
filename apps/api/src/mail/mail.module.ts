import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get('SMTP_HOST'),
                    port: configService.get<number>('SMTP_PORT'),
                    secure: false,
                    auth: {
                        user: configService.get('SMTP_USER'),
                        pass: configService.get('SMTP_PASSWORD'),
                    },
                },
            }),
        }),
    ],
    controllers: [],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
