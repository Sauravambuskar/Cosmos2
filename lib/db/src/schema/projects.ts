import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  location: text("location").notNull(),
  type: text("type").notNull(), // Residential | Commercial | Industrial
  status: text("status").notNull().default("Upcoming"), // Completed | Ongoing | Upcoming
  units: text("units").notNull().default(""), // "42 Exclusive Units"
  highlights: text("highlights").notNull().default(""), // "Private Pools, Home Automation"
  image: text("image").notNull().default(""),
  brochureUrl: text("brochure_url").notNull().default(""),
  videoUrl: text("video_url").notNull().default(""),
  area: text("area").notNull().default(""), // "19,000 Sq. Ft."
  amenities: text("amenities").array().notNull().default([]),
  gallery: text("gallery").array().notNull().default([]),
  rera: text("rera").notNull().default(""),
  possession: text("possession").notNull().default(""),
  priceRange: text("price_range").notNull().default(""),
  developer: text("developer").notNull().default("Cosmos Real Estate"),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = insertProjectSchema.partial();

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
