import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../infrastructure/database/db';
import { users } from '../../infrastructure/database/schema';
import { eq } from 'drizzle-orm';
import { MailService} from 'src/infrastructure/mail/mail.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
    private readonly mailService: MailService,
  ) {}


  async signup(dto: any) {
    const existing = await this.db.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email));

    if (existing.length > 0) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const [user] = await this.db.db
      .insert(users)
      .values({
        email: dto.email,
        password: hashed,
        created_at: new Date(), 
      })
      .returning();


    if (!user.email) {
      throw new BadRequestException('Email missing after registration');
    }

    await this.mailService.sendWelcomeMail(user.email, 'User'); 

    return {
      message: 'User registered successfully',
      user: { id: user.id, email: user.email },
    };
  }

 
  async login(dto: any, meta: any) {
    const [user] = await this.db.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email));

    if (!user) throw new BadRequestException('User not found');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

   
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is missing in environment');
    }

    const accessToken = this.jwt.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '10m', secret: jwtSecret },
    );

    const refreshToken = this.jwt.sign(
      { sub: user.id },
      { expiresIn: '7d', secret: jwtSecret },
    );

    return { accessToken, refreshToken };
  }


  async rotateRefreshToken(refreshToken: string, meta: any) {
    try {
      const decoded = this.jwt.verify(refreshToken);

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is missing');
      }

      const newAccessToken = this.jwt.sign(
        { sub: decoded.sub },
        { expiresIn: '10m', secret: jwtSecret },
      );

      return { accessToken: newAccessToken };

    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }


  async revokeRefreshToken(refreshToken: string) {
    return { message: 'Refresh token revoked' };
  }

 
  refresh(user: any) {
    return { message: 'Token refreshed', user };
  }
}
