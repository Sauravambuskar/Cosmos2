import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, siteSettingsTable, siteSettingsSchema, defaultSiteSettings } from "@workspace/db";

const router: IRouter = Router();

/**
 * Read the single settings row, filling in defaults for anything the admin has
 * not customised. Returns a complete object even when the row does not exist
 * yet, so the public site renders correctly on a fresh database.
 */
export async function readSiteSettings() {
  const [row] = await db.select().from(siteSettingsTable).orderBy(asc(siteSettingsTable.id)).limit(1);
  const parsed = siteSettingsSchema.safeParse(row?.data ?? {});
  return parsed.success ? parsed.data : defaultSiteSettings();
}

// GET /settings — public site configuration (brand, contact details, copy, flags).
router.get("/settings", async (req, res): Promise<void> => {
  try {
    const settings = await readSiteSettings();
    // Short cache: settings change rarely, but an edit should go live quickly.
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json(settings);
  } catch (err) {
    // The public site must render even if the settings table is unreachable —
    // falling back to defaults is far better than a blank page.
    req.log.error({ err }, "Failed to load site settings; serving defaults");
    res.json(defaultSiteSettings());
  }
});

export default router;
