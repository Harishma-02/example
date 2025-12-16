import { Injectable } from '@nestjs/common';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  createUser(
    name: string,
    email: string,
    password: string,
    createdBy: string='system',
  ): User {
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      password,
      createAt: new Date(),
      updatedAt: new Date(),
      createdBy,
      updatedBy: createdBy,
    };

    this.users.push(newUser);
    return newUser;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }
}
