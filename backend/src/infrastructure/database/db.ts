import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  public drizzle: NodePgDatabase;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.drizzle = drizzle(pool);
  }
}
