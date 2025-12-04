import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from '../users/dto/create-notification.dto';
import { NotificationType } from '../../shared/types/notification-type.enum';
import * as nodemailer from 'nodemailer';
import Twilio from 'twilio';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);

  private twilioClient: ReturnType<typeof Twilio>;

  constructor() {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    if (!sid || !token) {
      throw new Error('Twilio credentials are missing in .env');
    }

    // ✅ FIXED: No more string | undefined error
    this.twilioClient = Twilio(sid, token);
  }

  async sendNotification(dto: CreateNotificationDto): Promise<any> {
    switch (dto.type) {
      case NotificationType.EMAIL:
        return this.sendEmail(dto.to, dto.message);

      case NotificationType.SMS:
        return this.sendSMS(dto.to, dto.message);

      case NotificationType.PUSH:
        return this.sendPush(dto.to, dto.title ?? 'Notification', dto.message);

      default:
        throw new Error('Invalid notification type');
    }
  }

  // ✅ EMAIL
  private async sendEmail(to: string, message: string) {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      throw new Error('SMTP configuration is missing in .env');
    }

    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port, 10), // ✅ FIXED
      secure: false,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"No Reply" <${user}>`,
      to,
      subject: 'Notification',
      text: message,
    });

    this.logger.log(`Email sent: ${info.messageId}`);
    return info;
  }

  // ✅ SMS
  private async sendSMS(to: string, message: string) {
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!from) {
      throw new Error('Twilio phone number missing in .env');
    }

    const msg = await this.twilioClient.messages.create({
      body: message,
      from, // ✅ FIXED
      to,
    });

    this.logger.log(`SMS sent: ${msg.sid}`);
    return msg;
  }

  // ✅ PUSH
  private async sendPush(to: string, title: string, message: string) {
    this.logger.log(`Push sent to ${to} | Title: ${title} | Message: ${message}`);
    return { success: true };
  }
}
