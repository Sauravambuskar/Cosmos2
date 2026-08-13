import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, propertiesTable, contactsTable, publicContactSchema } from "@workspace/db";
import { readSiteSettings } from "./settings";

const router: IRouter = Router();

router.get("/properties", async (req, res): Promise<void> => {
  const { type, category, transactionType, featured } = req.query as Record<string, string | undefined>;

  const conditions = [eq(propertiesTable.status, "active")];
  if (type) conditions.push(eq(propertiesTable.type, type));
  if (category) conditions.push(eq(propertiesTable.category, category));
  if (transactionType) conditions.push(eq(propertiesTable.transactionType, transactionType));
  if (featured === "true") conditions.push(eq(propertiesTable.featured, true));

  const properties = await db
    .select()
    .from(propertiesTable)
    .where(and(...conditions))
    .orderBy(desc(propertiesTable.createdAt));

  res.json(properties);
});

router.get("/properties/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [property] = await db
    .select()
    .from(propertiesTable)
    .where(and(eq(propertiesTable.id, id), eq(propertiesTable.status, "active")));

  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  res.json(property);
});

router.post("/contacts", async (req, res): Promise<void> => {
  // Validated with the narrow public schema — the lead-pipeline fields
  // (leadStatus / notes / readAt) belong to staff and are not accepted here.
  const parsed = publicContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" });
    return;
  }

  const settings = await readSiteSettings().catch(() => null);
  if (settings && !settings.features.contactFormEnabled) {
    res.status(503).json({ error: "The enquiry form is currently closed. Please call us instead." });
    return;
  }

  const [contact] = await db
    .insert(contactsTable)
    .values({ ...parsed.data, leadStatus: "new" })
    .returning();

  req.log.info({ id: contact.id, interest: contact.interest }, "New public enquiry");
  res.status(201).json({ id: contact.id, ok: true });
});

export default router;
