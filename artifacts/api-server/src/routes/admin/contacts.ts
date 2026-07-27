import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, contactsTable } from "@workspace/db";
import { requireAdmin } from "../../middlewares/adminAuth";

const router: IRouter = Router();

// Scope auth to /admin/* only (routers are mounted at the root).
router.use("/admin", requireAdmin);

router.get("/admin/contacts", async (req, res): Promise<void> => {
  req.log.info("Admin: listing contacts");
  const contacts = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  res.json(contacts);
});

export default router;
