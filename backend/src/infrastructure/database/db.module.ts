import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DrizzleService } from './drizzle.service';

@Module({
  providers: [DatabaseService,DrizzleService],
  exports: [DatabaseService,DrizzleService], 
})
export class DatabaseModule {}
