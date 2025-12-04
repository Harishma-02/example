import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { MailProcessor } from './queue.processor';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailQueue', 
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailModule, 
  ],
  providers: [QueueService, MailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
