/** End-to-end verification of the live production site. */
const BASE = "https://www.cosmosrealestate.co.in";

let ok = true;
function report(pass, label, extra = "") {
  if (!pass) ok = false;
  console.log(`${pass ? "OK " : "ERR"} ${label} ${extra}`);
}

// Public data
for (const p of ["/api/projects", "/api/properties", "/api/projects?featured=true"]) {
  const r = await fetch(BASE + p);
  const d = r.ok ? await r.json() : [];
  report(r.ok && Array.isArray(d), `GET ${p} -> ${r.status}`, `${d.length ?? 0} rows`);
}

// Project detail
const projects = await (await fetch(`${BASE}/api/projects`)).json();
for (const p of projects) {
  const r = await fetch(`${BASE}/api/projects/${p.id}`);
  report(r.ok, `GET /api/projects/${p.id} -> ${r.status}`, p.name);
}

// Auth must be enforced
const noAuth = await fetch(`${BASE}/api/admin/projects`);
report(noAuth.status === 401, `GET /api/admin/projects unauthed -> ${noAuth.status}`, "(expect 401)");

// Admin login works in production
const login = await fetch(`${BASE}/api/admin/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "cosmos@225986" }),
});
report(login.ok, `POST /api/admin/login -> ${login.status}`);

if (login.ok) {
  const { token } = await login.json();
  for (const p of ["/api/admin/projects", "/api/admin/properties", "/api/admin/contacts"]) {
    const r = await fetch(BASE + p, { headers: { Authorization: `Bearer ${token}` } });
    const d = r.ok ? await r.json() : [];
    report(r.ok, `GET ${p} (authed) -> ${r.status}`, `${d.length ?? 0} rows`);
  }
}

// SPA deep links must not 404
for (const p of ["/projects", "/residential", "/commercial", "/industrial", "/contact", "/about", "/admin/login"]) {
  const r = await fetch(BASE + p);
  report(r.ok, `page ${p} -> ${r.status}`);
}

console.log(ok ? "\nLIVE SITE FULLY WORKING" : "\nSOME CHECKS FAILED");
process.exitCode = ok ? 0 : 1;
