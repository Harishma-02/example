import { pgTable, serial, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 255 }),

  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),

  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),

  created_by: integer('created_by'),
  updated_by: integer('updated_by'),
});
