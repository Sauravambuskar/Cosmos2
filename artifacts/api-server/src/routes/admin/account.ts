import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  adminUsersTable,
  changePasswordSchema,
  updateAdminProfileSchema,
} from "@workspace/db";
import { requireAdmin, type AdminRequest } from "../../middlewares/adminAuth";
import { hashPassword, verifyPassword, safeEqual } from "../../lib/password";

const router: IRouter = Router();

router.use("/admin", requireAdmin);

// GET /admin/account — the signed-in admin's own profile.
router.get("/admin/account", async (req: AdminRequest, res): Promise<void> => {
  const username = req.admin!.username;
  let user:
    | {
        username: string;
        displayName: string;
        email: string;
        lastLoginAt: Date | null;
        updatedAt: Date;
      }
    | undefined;
  try {
    [user] = await db
      .select({
        username: adminUsersTable.username,
        displayName: adminUsersTable.displayName,
        email: adminUsersTable.email,
        lastLoginAt: adminUsersTable.lastLoginAt,
        updatedAt: adminUsersTable.updatedAt,
      })
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, username));
  } catch (err) {
    req.log.warn({ err }, "admin_users unavailable; reporting bootstrap account");
  }

  res.json(
    user ?? {
      username,
      displayName: "",
      email: "",
      lastLoginAt: null,
      updatedAt: null,
      // No DB row yet: this session is still running on the env-var bootstrap
      // credential. The UI uses this to explain why the password lives in the
      // environment until it is changed once here.
      bootstrap: true,
    },
  );
});

router.patch("/admin/account", async (req: AdminRequest, res): Promise<void> => {
  const parsed = updateAdminProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db
    .update(adminUsersTable)
    .set(parsed.data)
    .where(eq(adminUsersTable.username, req.admin!.username))
    .returning();

  if (!user) {
    res.status(400).json({
      error: "Set a password first — your account is still using the bootstrap credentials.",
    });
    return;
  }

  res.json({ username: user.username, displayName: user.displayName, email: user.email });
});

/**
 * POST /admin/account/password — change the admin password.
 *
 * Works in both states: if a DB row exists the current password is checked
 * against its hash; if not, the env bootstrap credential is accepted once and
 * the row is created, moving the password into the database for good.
 */
router.post("/admin/account/password", async (req: AdminRequest, res): Promise<void> => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request" });
    return;
  }
  const { currentPassword, newPassword } = parsed.data;
  const username = req.admin!.username;

  if (currentPassword === newPassword) {
    res.status(400).json({ error: "The new password must be different from the current one." });
    return;
  }

  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, username));

  if (user) {
    if (!(await verifyPassword(currentPassword, user.passwordHash))) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    await db
      .update(adminUsersTable)
      .set({ passwordHash: await hashPassword(newPassword) })
      .where(eq(adminUsersTable.id, user.id));
  } else {
    const envPassword = process.env.ADMIN_PASSWORD;
    if (!envPassword || !safeEqual(currentPassword, envPassword)) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    await db.insert(adminUsersTable).values({
      username,
      passwordHash: await hashPassword(newPassword),
    });
  }

  req.log.info({ admin: username }, "Admin: password changed");
  res.json({
    ok: true,
    message:
      "Password updated. Existing sign-ins stay valid until their token expires — sign out elsewhere if you need them cut off now.",
  });
});

export default router;
