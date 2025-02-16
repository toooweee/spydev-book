import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendMail(options: { from: string; to: string; subject: string; text: string }) {
        return await this.mailerService.sendMail({
            from: options.from,
            to: options.to,
            subject: options.subject,
            text: options.text,
        });
    }
}
