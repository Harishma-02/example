import { Injectable, BadRequestException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { DrizzleService } from '../../infrastructure/database/drizzle.service';
import { users } from '../../infrastructure/database/schema';
import { UpdateUserDto } from './dto/update-user.dto';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  createdBy?: number;
}

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}

  // 🔹 FIND USER BY EMAIL
  async findByEmail(email: string) {
    const result = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] ?? null;
  }

  // 🔹 FIND ALL USERS
  async findAll() {
    return this.drizzle.db.select().from(users);
  }

  // 🔹 CREATE USER
  async createUser(data: CreateUserDto) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await this.drizzle.db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: data.createdBy ?? null,
        updated_by: data.createdBy ?? null,
      })
      .returning();

    return result[0];
  }

  // 🔹 UPDATE USER
async updateUser(id: number, data: UpdateUserDto) {
  const updateData: any = { updated_at: new Date() };

  if (data.name) updateData.name = data.name;
  if (data.email) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException('Email already in use by another user');
    }
    updateData.email = data.email;
  }
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

  const result = await this.drizzle.db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning();

  if (!result[0]) {
    throw new BadRequestException('User not found or update failed');
  }

  return result[0];
}
  async deleteUser(id: number) {
    const result = await this.drizzle.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!result[0]) {
      throw new BadRequestException('User not found or delete failed');
    }

    return { message: 'User deleted successfully' };
  }

}
