import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create')
  create(@Body() body: any) {
    return this.usersService.createUser(
      body.name,
      body.email,
      body.password,
      'system'
    );
  }
}
