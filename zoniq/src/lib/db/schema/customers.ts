import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: varchar('created_by', { length: 255 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    index('idx_customers_name').on(table.name),
    index('idx_customers_created_by').on(table.createdBy),
    index('idx_customers_is_active').on(table.isActive),
  ],
);
