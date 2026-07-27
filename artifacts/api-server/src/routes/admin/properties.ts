import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, propertiesTable, insertPropertySchema, updatePropertySchema } from "@workspace/db";
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
