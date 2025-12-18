import { Controller, Post, Body, BadRequestException, Get, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignupDto } from '../users/dto/signup.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // ---------- GET ALL USERS ----------
  @Get('users')
  async getUsers() {
    return this.usersService.findAll();
  }


    @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(Number(id), dto);
  }

   @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
  
  // ---------- SIGNUP ----------
 @Post('signup')
signup(@Body() dto: SignupDto) {
  return this.authService.signup(dto);
}

  // ---------- LOGIN ----------
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
    if (!refreshToken) throw new BadRequestException('refreshToken required');
    return this.authService.rotateRefreshToken(refreshToken);
  }

  // ---------- LOGOUT ----------
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('refreshToken required');
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
