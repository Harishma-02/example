import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../shared/entities/user.entity';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];

  createUser(name: string, email: string, password: string, createdBy: string) {
    const newUser: UserEntity = {
      id: Date.now(),
      name,
      email,
      password,
      createAt: new Date(),
      createdBy,
      updatedAt: new Date(),
      updatedBy: createdBy,
    };

    this.users.push(newUser);
    return newUser;
  }

  findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }
}
