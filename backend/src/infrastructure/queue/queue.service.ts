import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('mailQueue') 
    private readonly mailQueue: Queue,
  ) {}

  async addMailJob(data: any) {
    await this.mailQueue.add('sendMail', data); 
  }
}
