import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DrizzleService } from 'src/infrastructure/database/drizzle.service';
import { DatabaseModule } from 'src/infrastructure/database/db.module';

@Module({
  imports:[DatabaseModule],
  providers: [UsersService,DrizzleService],
  exports: [UsersService],
})
export class UsersModule {}
