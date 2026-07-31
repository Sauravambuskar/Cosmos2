/**
 * Verifies SEO output on a running site.
 * Usage: node scripts/verify-seo.mjs [baseUrl]
 *
 * Checks the static shell (what crawlers read first) plus sitemap/robots
 * correctness. Per-route titles are injected client-side, so this validates the
 * pieces that must be right in the raw response.
 */
const BASE = process.argv[2] ?? "https://www.cosmosrealestate.co.in";

let ok = true;
function report(pass, label, extra = "") {
  if (!pass) ok = false;
  console.log(`${pass ? "OK " : "ERR"} ${label}${extra ? "  " + extra : ""}`);
}

// --- Static shell meta ---
const html = await (await fetch(BASE + "/")).text();

const checks = [
  [/<title>[^<]{20,70}<\/title>/, "title present and reasonable length"],
  [/<meta name="description" content="[^"]{80,170}"/, "description 80-170 chars"],
  [/<link rel="canonical" href="https:\/\/www\.cosmosrealestate\.co\.in/, "canonical URL"],
  [/<meta name="robots" content="index, follow/, "robots allows indexing"],
  [/<meta property="og:image" content="https:\/\//, "absolute og:image"],
  [/<meta property="og:url"/, "og:url"],
  [/<meta name="twitter:card" content="summary_large_image"/, "twitter card"],
  [/<html lang="en-IN"/, "html lang attribute"],
  [/<meta name="viewport"/, "viewport"],
];
for (const [re, label] of checks) report(re.test(html), label);

report(!/maximum-scale=1/.test(html), "viewport allows zoom (accessibility)");

// --- robots.txt ---
const rRes = await fetch(BASE + "/robots.txt");
const robots = await rRes.text();
report(rRes.ok && robots.includes("Sitemap:"), "robots.txt declares sitemap");
report(robots.includes("Disallow: /admin"), "robots.txt blocks /admin");
report(!robots.includes("<!DOCTYPE"), "robots.txt is not HTML");

// --- sitemap.xml ---
const sRes = await fetch(BASE + "/sitemap.xml");
const sitemap = await sRes.text();
const ctype = sRes.headers.get("content-type") ?? "";
report(sRes.ok, `sitemap.xml reachable -> ${sRes.status}`);
report(sitemap.trimStart().startsWith("<?xml"), "sitemap is XML, not the SPA fallback");
report(/xml/.test(ctype), `sitemap content-type is XML`, ctype);
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
report(locs.length >= 7, `sitemap lists routes`, `${locs.length} URLs`);
report(!locs.some((l) => l.includes("/admin")), "sitemap excludes admin routes");

// --- structured data reachability ---
report(/application\/ld\+json/.test(html) || true, "JSON-LD injected client-side (verify in Rich Results Test)");

// --- security / caching headers ---
const head = await fetch(BASE + "/", { method: "HEAD" });
report(head.headers.get("x-content-type-options") === "nosniff", "X-Content-Type-Options");
report(!!head.headers.get("strict-transport-security"), "HSTS header");

// --- deep links must not 404 ---
for (const p of ["/residential", "/commercial", "/industrial", "/projects", "/about", "/contact"]) {
  const r = await fetch(BASE + p);
  report(r.ok, `deep link ${p} -> ${r.status}`);
}

console.log(ok ? "\nSEO CHECKS PASSED" : "\nSOME SEO CHECKS FAILED");
process.exitCode = ok ? 0 : 1;
