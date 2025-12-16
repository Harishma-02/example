import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('profile')
  create(@Body() body: any) {
    return this.usersService.createUser(
      body.name,
      body.email,
      body.password,
      'system'
    );
  }
}
