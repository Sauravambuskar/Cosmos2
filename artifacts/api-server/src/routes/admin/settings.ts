import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, siteSettingsTable, siteSettingsSchema, defaultSiteSettings } from "@workspace/db";
import { requireAdmin, type AdminRequest } from "../../middlewares/adminAuth";
import { readSiteSettings } from "../settings";

const router: IRouter = Router();

router.use("/admin", requireAdmin);

// GET /admin/settings — current settings, defaults filled in.
router.get("/admin/settings", async (req, res): Promise<void> => {
  req.log.info("Admin: reading site settings");
  try {
    res.json(await readSiteSettings());
  } catch (err) {
    // If the table has not been created yet, show the defaults so the editor is
    // usable; the save will report the real problem.
    req.log.warn({ err }, "site_settings unavailable; serving defaults to the editor");
    res.json(defaultSiteSettings());
  }
});

// PUT /admin/settings — replace the settings blob.
router.put("/admin/settings", async (req: AdminRequest, res): Promise<void> => {
  const parsed = siteSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select({ id: siteSettingsTable.id })
    .from(siteSettingsTable)
    .orderBy(asc(siteSettingsTable.id))
    .limit(1);

  if (existing) {
    await db
      .update(siteSettingsTable)
      .set({ data: parsed.data })
      .where(eq(siteSettingsTable.id, existing.id));
  } else {
    await db.insert(siteSettingsTable).values({ data: parsed.data });
  }

  req.log.info({ admin: req.admin?.username }, "Admin: updated site settings");
  res.json(parsed.data);
});

// POST /admin/settings/reset — restore the built-in defaults.
router.post("/admin/settings/reset", async (req: AdminRequest, res): Promise<void> => {
  const defaults = defaultSiteSettings();

  const [existing] = await db
    .select({ id: siteSettingsTable.id })
    .from(siteSettingsTable)
    .orderBy(asc(siteSettingsTable.id))
    .limit(1);

  if (existing) {
    await db
      .update(siteSettingsTable)
      .set({ data: defaults })
      .where(eq(siteSettingsTable.id, existing.id));
  } else {
    await db.insert(siteSettingsTable).values({ data: defaults });
  }

  req.log.warn({ admin: req.admin?.username }, "Admin: reset site settings to defaults");
  res.json(defaults);
});

export default router;
