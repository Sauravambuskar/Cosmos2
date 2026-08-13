import { Router, type IRouter } from "express";
import { eq, desc, inArray } from "drizzle-orm";
import {
  db,
  propertiesTable,
  insertPropertySchema,
  updatePropertySchema,
  bulkPropertySchema,
} from "@workspace/db";
import { requireAdmin, type AdminRequest } from "../../middlewares/adminAuth";

const router: IRouter = Router();

// Scope auth to /admin/* only. Without the path prefix this middleware would
// run for every request (these routers are mounted at the root), which would
// incorrectly block the public property endpoints.
router.use("/admin", requireAdmin);

router.get("/admin/properties", async (req, res): Promise<void> => {
  req.log.info("Admin: listing properties");
  const properties = await db.select().from(propertiesTable).orderBy(desc(propertiesTable.createdAt));
  res.json(properties);
});

router.post("/admin/properties", async (req: AdminRequest, res): Promise<void> => {
  const parsed = insertPropertySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [property] = await db.insert(propertiesTable).values(parsed.data).returning();
  req.log.info({ id: property.id }, "Admin: created property");
  res.status(201).json(property);
});

/**
 * POST /admin/properties/bulk — apply one action to many listings at once.
 * Registered before `/:id` handlers so "bulk" is never read as an id.
 */
router.post("/admin/properties/bulk", async (req: AdminRequest, res): Promise<void> => {
  const parsed = bulkPropertySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request" });
    return;
  }
  const { ids, action } = parsed.data;

  if (action === "delete") {
    const deleted = await db
      .delete(propertiesTable)
      .where(inArray(propertiesTable.id, ids))
      .returning({ id: propertiesTable.id });
    req.log.warn({ count: deleted.length }, "Admin: bulk deleted properties");
    res.json({ affected: deleted.length, ids: deleted.map((d) => d.id) });
    return;
  }

  const patch =
    action === "activate"
      ? { status: "active" }
      : action === "deactivate"
        ? { status: "inactive" }
        : action === "feature"
          ? { featured: true }
          : { featured: false };

  const updated = await db
    .update(propertiesTable)
    .set(patch)
    .where(inArray(propertiesTable.id, ids))
    .returning();

  req.log.info({ action, count: updated.length }, "Admin: bulk updated properties");
  res.json({ affected: updated.length, properties: updated });
});

/** POST /admin/properties/:id/duplicate — copy a listing as an inactive draft. */
router.post("/admin/properties/:id/duplicate", async (req: AdminRequest, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [source] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, id));
  if (!source) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = source;
  const [copy] = await db
    .insert(propertiesTable)
    .values({
      ...rest,
      title: `${source.title} (Copy)`,
      // A copy starts hidden so a half-edited duplicate never reaches visitors.
      status: "inactive",
      featured: false,
    })
    .returning();

  req.log.info({ from: id, to: copy.id }, "Admin: duplicated property");
  res.status(201).json(copy);
});

router.put("/admin/properties/:id", async (req: AdminRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = updatePropertySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [property] = await db
    .update(propertiesTable)
    .set(parsed.data)
    .where(eq(propertiesTable.id, id))
    .returning();

  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  req.log.info({ id }, "Admin: updated property");
  res.json(property);
});

router.delete("/admin/properties/:id", async (req: AdminRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [property] = await db
    .delete(propertiesTable)
    .where(eq(propertiesTable.id, id))
    .returning();

  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  req.log.info({ id }, "Admin: deleted property");
  res.sendStatus(204);
});

export default router;
