import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; 
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
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
  providers: [AppService , AuthService,JwtService],
    controllers: [AuthController],
  exports: [AuthService],
})
export class AppModule {}
