import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, adminUsersTable } from "@workspace/db";
import { signAdminToken, requireAdmin, type AdminRequest } from "../../middlewares/adminAuth";
import { hashPassword, verifyPassword, safeEqual } from "../../lib/password";

const router: IRouter = Router();

/**
 * Admin sign-in.
 *
 * Two credential sources, checked in order:
 *  1. The `admin_users` table — the real source once a password has been set.
 *  2. `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars — the bootstrap path for a
 *     fresh deployment. A successful bootstrap login seeds the DB row, so the
 *     password becomes changeable from the panel from then on.
 */
router.post("/admin/login", async (req, res): Promise<void> => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  // A missing `admin_users` table (schema not pushed yet) must not lock anyone
  // out — fall through to the env credentials instead of returning a 500.
  let user: typeof adminUsersTable.$inferSelect | undefined;
  try {
    [user] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, username));
  } catch (err) {
    req.log.warn({ err }, "admin_users unavailable; falling back to env credentials");
  }

  if (user) {
    if (!(await verifyPassword(password, user.passwordHash))) {
      req.log.warn({ username }, "Admin: failed login");
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    await db
      .update(adminUsersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminUsersTable.id, user.id));

    req.log.info({ username }, "Admin: login");
    res.json({ token: signAdminToken(username), username, displayName: user.displayName });
    return;
  }

  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envUsername || !envPassword) {
    res.status(500).json({
      error:
        "No admin account exists and bootstrap credentials are not configured on this server.",
    });
    return;
  }

  if (!safeEqual(username, envUsername) || !safeEqual(password, envPassword)) {
    req.log.warn({ username }, "Admin: failed login");
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // First login on this deployment — move the credential into the database.
  try {
    await db
      .insert(adminUsersTable)
      .values({
        username,
        passwordHash: await hashPassword(password),
        lastLoginAt: new Date(),
      })
      .onConflictDoNothing();
    req.log.info({ username }, "Admin: bootstrap login, account seeded");
  } catch (err) {
    // Seeding is an upgrade, not a requirement — sign-in still succeeds.
    req.log.warn({ err }, "Could not seed admin account; run the DB schema push");
  }

  res.json({ token: signAdminToken(username), username, displayName: "" });
});

/**
 * GET /admin/session — cheap token validity probe.
 *
 * The panel calls this on load so an expired or revoked token sends the user to
 * the login screen instead of silently rendering an empty dashboard.
 */
router.get("/admin/session", requireAdmin, (req: AdminRequest, res): void => {
  res.json({ valid: true, username: req.admin?.username });
});

export default router;
