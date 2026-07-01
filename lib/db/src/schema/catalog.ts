import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const catalogTable = pgTable("catalog", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  detail: text("detail").notNull(),
  price: text("price").notNull(),
  badge: text("badge").notNull().default(""),
  badgeVariant: text("badge_variant").notNull().default("orange"),
  iconType: text("icon_type").notNull().default("custom"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CatalogItem = typeof catalogTable.$inferSelect;
