import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, contactsTable, updateContactSchema } from "@workspace/db";
import { requireAdmin } from "../../middlewares/adminAuth";

const router: IRouter = Router();

// Scope auth to /admin/* only (routers are mounted at the root).
router.use("/admin", requireAdmin);

router.get("/admin/contacts", async (req, res): Promise<void> => {
  req.log.info("Admin: listing contacts");
  const contacts = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  res.json(contacts);
});

router.patch("/admin/contacts/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = updateContactSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [contact] = await db
    .update(contactsTable)
    .set(parsed.data)
    .where(eq(contactsTable.id, id))
    .returning();

  if (!contact) { res.status(404).json({ error: "Contact not found" }); return; }

  req.log.info({ id }, "Admin: updated contact");
  res.json(contact);
});

router.delete("/admin/contacts/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [contact] = await db
    .delete(contactsTable)
    .where(eq(contactsTable.id, id))
    .returning();

  if (!contact) { res.status(404).json({ error: "Contact not found" }); return; }

  req.log.info({ id }, "Admin: deleted contact");
  res.sendStatus(204);
});

export default router;
