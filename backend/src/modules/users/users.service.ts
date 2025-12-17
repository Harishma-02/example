import { Injectable } from '@nestjs/common';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async createUser(
    name: string,
    email: string,
    password: string,
    createdBy: string,
  ): Promise<User> {
    const now = new Date();

    const user: User = {
      id: Date.now(),
      name,
      email,
      password,
      createAt: now,
      createdBy,
      updatedAt: now,
      updatedBy: createdBy,
    };

    console.log('User created:', user);

    this.users.push(user); 
    return user;         
  }

  async findByEmail(email: string): Promise<User | undefined> {
    console.log('Finding email:', email);
    console.log('Current users array:', this.users);

    return this.users.find(u => u.email === email);
  }
}
