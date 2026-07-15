import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  message: text("message").notNull().default(""),
  interest: text("interest").notNull().default("general"), // residential | commercial | industrial | general
  leadStatus: text("lead_status").notNull().default("new"), // new | contacted | qualified | closed
  notes: text("notes").notNull().default(""),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContactSchema = createInsertSchema(contactsTable).omit({
  id: true,
  createdAt: true,
});

export const updateContactSchema = z.object({
  leadStatus: z.enum(["new", "contacted", "qualified", "closed"]).optional(),
  notes: z.string().optional(),
  readAt: z.coerce.date().optional(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type UpdateContact = z.infer<typeof updateContactSchema>;
export type Contact = typeof contactsTable.$inferSelect;
