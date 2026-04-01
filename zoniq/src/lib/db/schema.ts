import { pgTable, uuid, text, varchar, boolean, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'

export const appStatusEnum = pgEnum('app_status', ['active', 'inactive', 'in-development'])
export const environmentStatusEnum = pgEnum('environment_status', ['online', 'offline', 'deploying'])

// ── Users (synced from Clerk) ──────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 320 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  roles: text('roles').array().notNull().default([]),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Customers ──────────────────────────────────────────────────────────────────

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  organizationId: varchar('organization_id', { length: 255 }).notNull(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Apps ────────────────────────────────────────────────────────────────────────

export const apps = pgTable('apps', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  mendixAppId: varchar('mendix_app_id', { length: 100 }).notNull(),
  version: varchar('version', { length: 50 }).notNull().default('1.0.0'),
  status: appStatusEnum('status').notNull().default('in-development'),
  organizationId: varchar('organization_id', { length: 255 }).notNull(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Modules ────────────────────────────────────────────────────────────────────

export const modules = pgTable('modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  appId: uuid('app_id').notNull().references(() => apps.id),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Features ───────────────────────────────────────────────────────────────────

export const features = pgTable('features', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id').notNull().references(() => modules.id),
  appId: uuid('app_id').notNull().references(() => apps.id),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Environments (per-app deployment environments) ─────────────────────────────

export const environments = pgTable('environments', {
  id: uuid('id').primaryKey().defaultRandom(),
  appId: uuid('app_id').notNull().references(() => apps.id),
  name: varchar('name', { length: 100 }).notNull(),
  url: text('url').notNull(),
  status: environmentStatusEnum('status').notNull().default('offline'),
  version: varchar('version', { length: 50 }).notNull().default('—'),
  lastPing: timestamp('last_ping', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── App Environments (dashboard health tracking) ───────────────────────────────

export const appEnvironments = pgTable('app_environments', {
  id: uuid('id').primaryKey().defaultRandom(),
  appId: uuid('app_id').notNull().references(() => apps.id),
  environmentName: varchar('environment_name', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('offline'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
