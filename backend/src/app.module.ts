import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; 
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { MailModule } from './infrastructure/mail/mail.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 10_000, 
      max: 100,
      isGlobal: true,
    }),
    MailModule,
    UsersModule,
    AuthModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
