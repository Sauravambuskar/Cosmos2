import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

/**
 * Admin accounts.
 *
 * Login used to be env-var only (`ADMIN_USERNAME` / `ADMIN_PASSWORD`), which
 * meant the password could not be changed without a redeploy. The env pair is
 * still honoured as a bootstrap credential: the first successful login with it
 * seeds a row here, and from then on the password lives in the database and is
 * changeable from the admin panel.
 */
export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull().default(""),
  email: text("email").notNull().default(""),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const updateAdminProfileSchema = z.object({
  displayName: z.string().max(80).optional(),
  email: z.string().max(160).optional(),
});

export type AdminUser = typeof adminUsersTable.$inferSelect;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
