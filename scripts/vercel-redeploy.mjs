/** Triggers a production redeploy of the latest commit and polls until done. */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const PROJECT_ID = "prj_PJH1UBvE0pLWF6xiIFc7OkhFIbCU";
const TEAM_ID = "team_15kGsD13J9aJUf5ytEh3tmXD";

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
const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
const sha = execSync("git rev-parse HEAD").toString().trim();

const res = await fetch(`https://api.vercel.com/v13/deployments?teamId=${TEAM_ID}&forceNew=1&skipAutoDetectionConfirmation=1`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "cosmos2-api-server",
    project: PROJECT_ID,
    target: "production",
    gitSource: {
      type: "github",
      org: "Sauravambuskar",
      repo: "Cosmos2",
      ref: "main",
      sha,
    },
  }),
});

const dep = await res.json();
if (!res.ok) {
  console.error("create failed:", res.status, JSON.stringify(dep).slice(0, 500));
  process.exit(1);
}
console.log("deployment:", dep.id, "sha:", sha.slice(0, 7));

// Poll
const statusUrl = `https://api.vercel.com/v13/deployments/${dep.id}?teamId=${TEAM_ID}`;
for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 5000));
  const d = await (await fetch(statusUrl, { headers })).json();
  const state = d.readyState ?? d.status;
  process.stdout.write(`  ${state}\n`);
  if (["READY", "ERROR", "CANCELED"].includes(state)) {
    console.log("FINAL:", state);
    if (state !== "READY") {
      console.log("deployment id for logs:", dep.id);
      process.exitCode = 1;
    }
    break;
  }
}
