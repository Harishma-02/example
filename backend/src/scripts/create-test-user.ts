import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { users } from '../infrastructure/database/schema';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harisraj',
  database: 'postgres',
});

const db = drizzle(pool);

async function main() {

  const hashedPassword = await bcrypt.hash('vignesh123', 10);

  await db.insert(users).values({
  email: 'vignesh@example.com',
  password: hashedPassword,
  created_at: new Date(),
  updated_at: new Date(),
});


  console.log('User inserted successfully');
}

main()
  .catch((err) => console.error(err))
  .finally(async () => {
    await pool.end();
  });
