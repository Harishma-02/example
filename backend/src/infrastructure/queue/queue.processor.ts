import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailService } from '../mail/mail.service';
import { Job } from 'bullmq';

@Processor('mailQueue')
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job) {
    // job.data should have: { to, subject, text, html }
    await this.mailService.sendMail(job.data);
  }
}
