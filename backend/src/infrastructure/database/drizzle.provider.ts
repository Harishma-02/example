import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name',
});

export const db = drizzle(pool, { logger: true });
