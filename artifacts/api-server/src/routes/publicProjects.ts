import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";

const router: IRouter = Router();

// GET /projects — list all active projects
router.get("/projects", async (req, res): Promise<void> => {
  const { type, status, featured } = req.query as Record<string, string | undefined>;

  const conditions = [eq(projectsTable.active, true)];
  if (type) conditions.push(eq(projectsTable.type, type));
  if (status) conditions.push(eq(projectsTable.status, status));
  if (featured === "true") conditions.push(eq(projectsTable.featured, true));

  const projects = await db
    .select()
    .from(projectsTable)
    .where(and(...conditions))
    .orderBy(desc(projectsTable.createdAt));

  res.json(projects);
});

// GET /projects/:id — single project detail
router.get("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.active, true)));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(project);
});

export default router;
