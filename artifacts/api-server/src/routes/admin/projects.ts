import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, projectsTable, insertProjectSchema, updateProjectSchema } from "@workspace/db";
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
