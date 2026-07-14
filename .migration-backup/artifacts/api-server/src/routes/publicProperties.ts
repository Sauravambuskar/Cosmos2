import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, propertiesTable, contactsTable, insertContactSchema } from "@workspace/db";

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
  const parsed = insertContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [contact] = await db.insert(contactsTable).values(parsed.data).returning();
  res.status(201).json(contact);
});

export default router;
