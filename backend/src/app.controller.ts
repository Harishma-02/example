import { Controller,  Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  login() {}
}
export class appController {};