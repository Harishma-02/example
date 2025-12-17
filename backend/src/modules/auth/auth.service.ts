import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // ----------------- SIGNUP -----------------
async signup(dto: { name: string; email: string; password: string }) {
  const existing = await this.usersService.findByEmail(dto.email);
  if (existing) throw new BadRequestException('Email already exists');

  const hashed = await bcrypt.hash(dto.password, 10); // hash the password

  const user = await this.usersService.createUser(
    dto.name,
    dto.email,
    hashed,
    'system',
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}




  // ----------------- LOGIN -----------------
async login(dto: { email: string; password: string }) {
  console.log('Login attempt for email:', dto.email); 

  const user = await this.usersService.findByEmail(dto.email);
  console.log('User from DB:', user); 

  if (!user) throw new UnauthorizedException('Invalid credentials');

  const isValid = await bcrypt.compare(dto.password, user.password);
  console.log('Stored hashed password:', user.password); 
  console.log('Password match:', isValid); 

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
    return { message: 'Logged out successfully' }; // only message
  }

  // ----------------- REFRESH ACCESS TOKEN -----------------
  async refresh(user: { id: number; username: string }) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwt.sign(payload, { expiresIn: '10m' });
    return { accessToken };
  }
}
