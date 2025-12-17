import {  Controller,  Post,  Body,  Req,  BadRequestException,  Get,  UseGuards,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: { name: string; email: string; password: string }) {
    const user = await this.authService.signup(dto);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: { user },
    };
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    const user = await this.authService.login(dto);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: { user },
    };
  }

  // ---------- REFRESH USING TOKEN ----------
 @Post('refresh')
async refresh(@Body('refreshToken') refreshToken: string) {
  if (!refreshToken) {
    throw new BadRequestException('refreshToken required');
  }

  return this.authService.rotateRefreshToken(refreshToken);
}


  // ---------- LOGOUT ----------
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('refreshToken required');
    }

    await this.authService.revokeRefreshToken(refreshToken);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: { message: 'Logged out successfully' },
    };
  }

  // ---------- PROFILE ----------
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: any) {
    return {
      data: user,
    };
  }

  // ---------- REFRESH WITH GUARD ----------
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshWithGuard(@GetUser() user: any) {
    const token = await this.authService.refresh(user);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: token,
    };
  }
}
