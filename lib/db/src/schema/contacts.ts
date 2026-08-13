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

/**
 * What the public enquiry form is allowed to send.
 *
 * Deliberately narrower than `insertContactSchema`: the pipeline fields
 * (`leadStatus`, `notes`, `readAt`) are set by staff in the admin panel. If the
 * public endpoint accepted them, anyone could post an enquiry already marked
 * "closed" and it would never surface as a new lead.
 */
export const publicContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email("A valid email is required").max(160),
  phone: z.string().trim().max(40).default(""),
  message: z.string().trim().max(4000).default(""),
  interest: z.enum(["residential", "commercial", "industrial", "general"]).default("general"),
});

export const updateContactSchema = z.object({
  leadStatus: z.enum(["new", "contacted", "qualified", "closed"]).optional(),
  notes: z.string().optional(),
  readAt: z.coerce.date().nullable().optional(),
});

/** Bulk operations from the leads table. */
export const bulkContactSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, "Select at least one lead"),
  action: z.enum(["delete", "mark-read", "mark-unread", "set-status"]),
  leadStatus: z.enum(["new", "contacted", "qualified", "closed"]).optional(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type PublicContact = z.infer<typeof publicContactSchema>;
export type UpdateContact = z.infer<typeof updateContactSchema>;
export type Contact = typeof contactsTable.$inferSelect;
