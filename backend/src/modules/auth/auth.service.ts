import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from '../users/dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly usersService: UsersService,
  ) {}
  

  // ----------------- SIGNUP -----------------
 async signup(dto: SignupDto) {
  const existingUser = await this.usersService.findByEmail(dto.email);
  if (existingUser) {
    throw new BadRequestException('Email already in use');
  }

  const user = await this.usersService.createUser({
    name: dto.name,
    email: dto.email,
    password: dto.password,
    createdBy: 0,
  });

  return user;
}
  // ----------------- LOGIN -----------------
  async login(dto: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { username: user.email, sub: user.id };
    const accessToken = this.jwt.sign(payload, { expiresIn: '10m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '1d' });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  // ----------------- ROTATE REFRESH TOKEN -----------------
  async rotateRefreshToken(refreshToken: string) {
    try {
      const payload: any = this.jwt.verify(refreshToken);

      const accessToken = this.jwt.sign(
        { username: payload.username, sub: payload.sub },
        { expiresIn: '10m' },
      );

      const newRefreshToken = this.jwt.sign(
        { username: payload.username, sub: payload.sub },
        { expiresIn: '1d' },
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // ----------------- REVOKE REFRESH TOKEN -----------------
  async revokeRefreshToken(refreshToken: string) {
    // Optionally remove token from DB / blacklist
    return { message: 'Logged out successfully' };
  }

  // ----------------- REFRESH ACCESS TOKEN -----------------
  async refresh(user: { id: number; username: string }) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwt.sign(payload, { expiresIn: '10m' });
    return { accessToken };
  }
}
