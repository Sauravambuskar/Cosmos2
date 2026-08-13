import { Router, type IRouter } from "express";
import { eq, desc, inArray } from "drizzle-orm";
import {
  db,
  projectsTable,
  insertProjectSchema,
  updateProjectSchema,
  bulkProjectSchema,
} from "@workspace/db";
import { requireAdmin, type AdminRequest } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.use("/admin", requireAdmin);

// GET /admin/projects — list all projects (including inactive)
router.get("/admin/projects", async (req, res): Promise<void> => {
  req.log.info("Admin: listing projects");
  const projects = await db.select().from(projectsTable).orderBy(desc(projectsTable.createdAt));
  res.json(projects);
});

// POST /admin/projects — create a new project
router.post("/admin/projects", async (req: AdminRequest, res): Promise<void> => {
  const parsed = insertProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db.insert(projectsTable).values(parsed.data).returning();
  req.log.info({ id: project.id }, "Admin: created project");
  res.status(201).json(project);
});

// POST /admin/projects/bulk — apply one action to many projects at once.
router.post("/admin/projects/bulk", async (req: AdminRequest, res): Promise<void> => {
  const parsed = bulkProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request" });
    return;
  }
  const { ids, action } = parsed.data;

  if (action === "delete") {
    const deleted = await db
      .delete(projectsTable)
      .where(inArray(projectsTable.id, ids))
      .returning({ id: projectsTable.id });
    req.log.warn({ count: deleted.length }, "Admin: bulk deleted projects");
    res.json({ affected: deleted.length, ids: deleted.map((d) => d.id) });
    return;
  }

  const patch =
    action === "activate"
      ? { active: true }
      : action === "deactivate"
        ? { active: false }
        : action === "feature"
          ? { featured: true }
          : { featured: false };

  const updated = await db
    .update(projectsTable)
    .set(patch)
    .where(inArray(projectsTable.id, ids))
    .returning();

  req.log.info({ action, count: updated.length }, "Admin: bulk updated projects");
  res.json({ affected: updated.length, projects: updated });
});

// POST /admin/projects/:id/duplicate — copy a project as a hidden draft.
router.post("/admin/projects/:id/duplicate", async (req: AdminRequest, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [source] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
  if (!source) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = source;
  const [copy] = await db
    .insert(projectsTable)
    .values({ ...rest, name: `${source.name} (Copy)`, active: false, featured: false })
    .returning();

  req.log.info({ from: id, to: copy.id }, "Admin: duplicated project");
  res.status(201).json(copy);
});

// PUT /admin/projects/:id — update a project
router.put("/admin/projects/:id", async (req: AdminRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = updateProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db
    .update(projectsTable)
    .set(parsed.data)
    .where(eq(projectsTable.id, id))
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  req.log.info({ id }, "Admin: updated project");
  res.json(project);
});

// DELETE /admin/projects/:id — delete a project
router.delete("/admin/projects/:id", async (req: AdminRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [project] = await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, id))
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  req.log.info({ id }, "Admin: deleted project");
  res.sendStatus(204);
});

export default router;
