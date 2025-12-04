import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  // Generic sendMail function
  async sendMail(data: { to: string; subject: string; text?: string; html?: string }) {
    return this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
  }

  // Specific function for welcome emails
  async sendWelcomeMail(to: string, username: string) {
    return this.mailerService.sendMail({
      to,
      subject: 'Welcome to Our Platform!',
      html: `<h1>Hello ${username},</h1><p>Welcome to our platform. We are excited to have you!</p>`,
    });
  }
}
