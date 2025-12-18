import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DrizzleService implements OnModuleInit {
  public db;

  async onModuleInit() {
    const pool = new Pool({
      host: process.env.DB_HOST,
port: Number(process.env.DB_PORT),
user: process.env.DB_USER,
password: String(process.env.DB_PASSWORD),
database: process.env.DB_NAME,

    });

    await pool.query('SELECT 1');
    console.log('Database connected');

    this.db = drizzle(pool, { logger: true });
  }
}
