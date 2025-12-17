import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; 
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/db.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
      max: 100,
    }),
    MailModule,
    UsersModule,
    AuthModule,
  ],
  providers: [AppService], 
})
export class AppModule {}
