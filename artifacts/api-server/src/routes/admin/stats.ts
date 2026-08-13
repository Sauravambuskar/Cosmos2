import { Router, type IRouter } from "express";
import { db, propertiesTable, projectsTable, contactsTable } from "@workspace/db";
import { requireAdmin } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.use("/admin", requireAdmin);

function startOfDayUTC(daysAgo: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d;
}

/**
 * GET /admin/stats — everything the dashboard needs in one round trip.
 *
 * Aggregation happens here rather than in the browser so the dashboard does not
 * have to download every property and every lead just to count them.
 */
router.get("/admin/stats", async (req, res): Promise<void> => {
  req.log.info("Admin: computing dashboard stats");

  const [properties, projects, contacts] = await Promise.all([
    db
      .select({
        type: propertiesTable.type,
        status: propertiesTable.status,
        featured: propertiesTable.featured,
        transactionType: propertiesTable.transactionType,
        priceValue: propertiesTable.priceValue,
      })
      .from(propertiesTable),
    db
      .select({
        type: projectsTable.type,
        status: projectsTable.status,
        active: projectsTable.active,
        featured: projectsTable.featured,
      })
      .from(projectsTable),
    db
      .select({
        interest: contactsTable.interest,
        leadStatus: contactsTable.leadStatus,
        readAt: contactsTable.readAt,
        createdAt: contactsTable.createdAt,
      })
      .from(contactsTable),
  ]);

  const count = <T>(rows: T[], pred: (r: T) => boolean) => rows.filter(pred).length;
  const tally = <T>(rows: T[], key: (r: T) => string): Record<string, number> =>
    rows.reduce<Record<string, number>>((acc, r) => {
      const k = key(r);
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});

  const weekAgo = startOfDayUTC(6);
  const monthAgo = startOfDayUTC(29);

  // Leads per day for the last 7 days, zero-filled so the chart has no gaps.
  const trend: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = startOfDayUTC(i);
    const next = startOfDayUTC(i - 1);
    trend.push({
      date: day.toISOString().slice(0, 10),
      count: count(contacts, (c) => c.createdAt >= day && c.createdAt < next),
    });
  }

  const activeProperties = count(properties, (p) => p.status === "active");

  res.json({
    properties: {
      total: properties.length,
      active: activeProperties,
      inactive: properties.length - activeProperties,
      featured: count(properties, (p) => p.featured),
      forSale: count(properties, (p) => p.transactionType === "buy"),
      forRent: count(properties, (p) => p.transactionType === "rent"),
      byType: tally(properties, (p) => p.type),
      // Portfolio value of active listings, in lakhs, for a headline figure.
      activeValueLakhs: properties
        .filter((p) => p.status === "active")
        .reduce((sum, p) => sum + (p.priceValue ?? 0), 0),
    },
    projects: {
      total: projects.length,
      active: count(projects, (p) => p.active),
      featured: count(projects, (p) => p.featured),
      byStatus: tally(projects, (p) => p.status),
      byType: tally(projects, (p) => p.type),
    },
    leads: {
      total: contacts.length,
      unread: count(contacts, (c) => c.readAt === null),
      new: count(contacts, (c) => c.leadStatus === "new"),
      last7Days: count(contacts, (c) => c.createdAt >= weekAgo),
      last30Days: count(contacts, (c) => c.createdAt >= monthAgo),
      byStatus: tally(contacts, (c) => c.leadStatus),
      byInterest: tally(contacts, (c) => c.interest),
      trend,
    },
  });
});

export default router;
