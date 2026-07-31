/**
 * Finds which Vercel project serves a given domain, and prints its
 * git connection, build settings and env-var names.
 */
import { readFileSync } from "node:fs";

const TARGET = process.argv[2] ?? "cosmosrealestate.co.in";

function findToken() {
  const roots = [
    `${process.env.APPDATA}\\com.vercel.cli\\Data\\auth.json`,
    `${process.env.APPDATA}\\xdg.data\\com.vercel.cli\\auth.json`,
    `${process.env.APPDATA}\\com.vercel.cli\\auth.json`,
    `${process.env.LOCALAPPDATA}\\com.vercel.cli\\auth.json`,
    `${process.env.USERPROFILE}\\.local\\share\\com.vercel.cli\\auth.json`,
  ];
  for (const p of roots) {
    try {
      const j = JSON.parse(readFileSync(p, "utf-8"));
      if (j.token) return j.token;
    } catch { /* next */ }
  }
  return null;
}

const token = findToken();
if (!token) {
  console.error("NO_TOKEN — run `npx vercel login` first");
  process.exit(1);
}

const headers = { Authorization: `Bearer ${token}` };
const api = async (p) => {
  const r = await fetch(`https://api.vercel.com${p}`, { headers });
  if (!r.ok) throw new Error(`${p} -> ${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
};

// Personal scope + all teams
const teams = (await api("/v2/teams").catch(() => ({ teams: [] }))).teams ?? [];
const scopes = [{ id: null, name: "personal" }, ...teams.map((t) => ({ id: t.id, name: t.slug ?? t.name }))];
console.log("scopes:", scopes.map((s) => s.name).join(", "));

for (const scope of scopes) {
  const q = scope.id ? `?teamId=${scope.id}&limit=100` : "?limit=100";
  let projects;
  try {
    projects = (await api(`/v9/projects${q}`)).projects ?? [];
  } catch (e) {
    console.log(`\n[${scope.name}] could not list: ${e.message}`);
    continue;
  }

  for (const p of projects) {
    const dq = scope.id ? `?teamId=${scope.id}` : "";
    let domains = [];
    try {
      domains = (await api(`/v9/projects/${p.id}/domains${dq}`)).domains ?? [];
    } catch { /* ignore */ }

    const names = domains.map((d) => d.name);
    if (!names.some((n) => n.includes(TARGET))) continue;

    console.log("\n===== PROJECT SERVING " + TARGET + " =====");
    console.log("  scope          :", scope.name, scope.id ? `(${scope.id})` : "");
    console.log("  project name   :", p.name);
    console.log("  project id     :", p.id);
    console.log("  domains        :", names.join(", "));
    console.log("  rootDirectory  :", p.rootDirectory);
    console.log("  framework      :", p.framework);
    console.log("  buildCommand   :", p.buildCommand);
    console.log("  outputDirectory:", p.outputDirectory);
    console.log("  installCommand :", p.installCommand);
    const link = p.link ?? {};
    console.log("  git repo       :", link.org ? `${link.org}/${link.repo}` : "(NOT CONNECTED)");
    console.log("  production br  :", link.productionBranch ?? "(none)");
    const envNames = [...new Set((p.env ?? []).map((e) => e.key))];
    console.log("  env vars       :", envNames.length ? envNames.join(", ") : "(none)");
    for (const need of ["DATABASE_URL", "JWT_SECRET", "ADMIN_USERNAME", "ADMIN_PASSWORD"]) {
      console.log(`    ${need}: ${envNames.includes(need) ? "SET" : "MISSING"}`);
    }

    const deps = (await api(`/v6/deployments?projectId=${p.id}${scope.id ? `&teamId=${scope.id}` : ""}&limit=5`)).deployments ?? [];
    console.log("  recent deployments:");
    for (const d of deps) {
      console.log(`    ${d.uid} state=${d.readyState ?? d.state} target=${d.target} branch=${d.meta?.githubCommitRef ?? "?"} ${new Date(d.created).toISOString()}`);
    }
  }
}
