import { sql } from 'drizzle-orm';
import { pgTable, serial, varchar, integer, timestamp, boolean, uniqueIndex } from 'drizzle-orm/pg-core';

export const seeds = pgTable(
  'seeds',
  {
    id: serial('id').primaryKey(),
    peso_kg: integer('peso_kg').notNull(),
    origen: varchar('origen', { length: 100 }).notNull(),
    lote: varchar('lote', { length: 50 }).notNull(),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at').defaultNow(),
    closed_at: timestamp('closed_at'),
  },
  (table) => ({
    uniqueActiveLote: uniqueIndex('unique_active_lote')
      .on(table.lote)
      .where(sql`${table.is_active} = true`),
  }),
);
