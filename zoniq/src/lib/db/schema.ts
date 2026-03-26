import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core'

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: varchar('organization_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [index('idx_customers_organization_id').on(table.organizationId)]
)
