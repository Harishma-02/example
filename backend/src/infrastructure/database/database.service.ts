// src/infrastructure/database/db.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  drizzle: any;

  constructor() {
    this.drizzle = {}; 
}
}
