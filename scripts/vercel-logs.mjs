/** Prints build logs for a deployment. Usage: node scripts/vercel-logs.mjs <deploymentId> */
import { readFileSync } from "node:fs";

function findToken() {
  const roots = [
    `${process.env.APPDATA}\\com.vercel.cli\\Data\\auth.json`,
    `${process.env.APPDATA}\\xdg.data\\com.vercel.cli\\auth.json`,
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
const id = process.argv[2];
const TEAM = "team_15kGsD13J9aJUf5ytEh3tmXD";
const headers = { Authorization: `Bearer ${token}` };

const r = await fetch(
  `https://api.vercel.com/v3/deployments/${id}/events?builds=1&limit=400&teamId=${TEAM}`,
  { headers },
);
if (!r.ok) {
  console.error("failed:", r.status, (await r.text()).slice(0, 300));
  process.exit(1);
}

const events = await r.json();
const lines = (Array.isArray(events) ? events : events.events ?? [])
  .map((e) => (typeof e.text === "string" ? e.text : e.payload?.text ?? ""))
  .filter(Boolean);

for (const l of lines) process.stdout.write(l.endsWith("\n") ? l : l + "\n");
