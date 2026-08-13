import { Router, type IRouter } from "express";
import { desc, eq, inArray } from "drizzle-orm";
import { db, contactsTable, updateContactSchema, bulkContactSchema } from "@workspace/db";
import { requireAdmin, type AdminRequest } from "../../middlewares/adminAuth";

const router: IRouter = Router();

// Scope auth to /admin/* only (routers are mounted at the root).
router.use("/admin", requireAdmin);

router.get("/admin/contacts", async (req, res): Promise<void> => {
  req.log.info("Admin: listing contacts");
  const contacts = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  res.json(contacts);
});

/**
 * POST /admin/contacts/bulk — status changes, read/unread and deletion applied
 * to a selection. Registered before `/:id` so "bulk" is not parsed as an id.
 */
router.post("/admin/contacts/bulk", async (req: AdminRequest, res): Promise<void> => {
  const parsed = bulkContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request" });
    return;
  }
  const { ids, action, leadStatus } = parsed.data;

  if (action === "delete") {
    const deleted = await db
      .delete(contactsTable)
      .where(inArray(contactsTable.id, ids))
      .returning({ id: contactsTable.id });
    req.log.warn({ count: deleted.length }, "Admin: bulk deleted contacts");
    res.json({ affected: deleted.length, ids: deleted.map((d) => d.id) });
    return;
  }

  if (action === "set-status" && !leadStatus) {
    res.status(400).json({ error: "leadStatus is required for the set-status action" });
    return;
  }

  const patch =
    action === "mark-read"
      ? { readAt: new Date() }
      : action === "mark-unread"
        ? { readAt: null }
        : { leadStatus: leadStatus! };

  const updated = await db
    .update(contactsTable)
    .set(patch)
    .where(inArray(contactsTable.id, ids))
    .returning();

  req.log.info({ action, count: updated.length }, "Admin: bulk updated contacts");
  res.json({ affected: updated.length, contacts: updated });
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
