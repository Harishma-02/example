import {  Controller,  Post,  Body,  Req,  BadRequestException,  Get,  UseGuards,  UseInterceptors,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import express from 'express';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: express.Request) {
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'] as string,
    };
    return this.authService.login(dto, meta);
  }

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Req() req: express.Request,
  ) {
    if (!refreshToken) throw new BadRequestException('refreshToken required');

    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'] as string,
    };
    return this.authService.rotateRefreshToken(refreshToken, meta);
  }

  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('refreshToken required');
    }

    return this.authService.revokeRefreshToken(refreshToken);
  }

  @UseInterceptors(LoggingInterceptor)
  @Get('test')
  testRoute() {
    return { message: 'Interceptor applied!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user) {
    return user;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')   // ✅ renamed to avoid conflict
  refreshToken(@GetUser() user) {
    return this.authService.refresh(user);
  }
}
