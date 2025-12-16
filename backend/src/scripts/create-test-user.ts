import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { users } from '../infrastructure/database/schema';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name',
});

const db = drizzle(pool);

async function main() {
  const hashedPassword = await bcrypt.hash('vignesh123', 10);

  const user = await db.insert(users).values({
    email: 'vignesh@example.com',
    password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date(),
  }).returning();

  console.log('User created:', user);
}

main()
  .catch(console.error)
  .finally(() => pool.end());
