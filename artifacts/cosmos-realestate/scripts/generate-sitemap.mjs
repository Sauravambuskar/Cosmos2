/**
 * Generates sitemap.xml and robots.txt into the build output.
 *
 * Project detail URLs are pulled from the live API so newly published projects
 * appear in the sitemap without a code change. If the API is unreachable the
 * static routes are still written — a partial sitemap is better than none.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://www.cosmosrealestate.co.in";
const API = process.env.SITEMAP_API_BASE ?? SITE;
const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "..", "dist", "public");

// changefreq/priority are hints; listing pages change more often than About.
const staticRoutes = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/residential", changefreq: "daily", priority: "0.9" },
  { path: "/commercial", changefreq: "daily", priority: "0.9" },
  { path: "/industrial", changefreq: "daily", priority: "0.9" },
  { path: "/projects", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
];

async function fetchProjects() {
  try {
    const res = await fetch(`${API}/api/projects`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    console.warn("sitemap: could not reach API, writing static routes only");
    return [];
  }
}

const projects = await fetchProjects();
const today = new Date().toISOString().split("T")[0];

const urls = [
  ...staticRoutes.map((r) => ({ ...r, lastmod: today })),
  ...projects.map((p) => ({
    path: `/projects/${p.id}`,
    changefreq: "weekly",
    priority: "0.7",
    lastmod: (p.updatedAt ?? p.createdAt ?? today).toString().split("T")[0],
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.path}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `# Cosmos Real Estate
User-agent: *
Allow: /

# Admin area is private and must not be indexed.
Disallow: /admin
Disallow: /admin/

# Block API responses from search results.
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "sitemap.xml"), xml, "utf-8");
writeFileSync(resolve(outDir, "robots.txt"), robots, "utf-8");

console.log(`sitemap.xml written with ${urls.length} URLs (${projects.length} projects)`);
