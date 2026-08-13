import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const propertiesTable = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  type: text("type").notNull(), // residential | commercial | industrial
  category: text("category").notNull(), // flat | bungalow | row-house | duplex | office | co-working | managed-office | shop | showroom | hotel | warehouse | factory | industrial-plot
  transactionType: text("transaction_type").notNull(), // buy | rent
  price: text("price").notNull(), // "1.2 Cr" | "85 L" | "25,000/mo"
  priceValue: integer("price_value").notNull().default(0), // numeric for sorting (in lakhs)
  area: integer("area").notNull().default(0), // sqft
  bhk: integer("bhk"), // nullable for commercial/industrial
  location: text("location").notNull(), // "Koregaon Park, Pune"
  address: text("address").notNull().default(""),
  images: text("images").array().notNull().default([]),
  amenities: text("amenities").array().notNull().default([]),
  status: text("status").notNull().default("active"), // active | inactive
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePropertySchema = insertPropertySchema.partial();

/** Bulk operations from the admin listings table. */
export const bulkPropertySchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, "Select at least one listing"),
  action: z.enum(["activate", "deactivate", "feature", "unfeature", "delete"]),
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;
