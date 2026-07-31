/**
 * Clears the dashboard-level overrides on the project that serves
 * cosmosrealestate.co.in so the repo-root vercel.json takes effect.
 *
 * Why this is needed: the project had rootDirectory pinned to
 * artifacts/api-server, which made Vercel resolve outputDirectory relative to
 * that folder and fail with 'No Output Directory named "public" found'. It also
 * hid the repo-root api/ function directory. Framework was misdetected as nitro.
 */
import { readFileSync } from "node:fs";

const PROJECT_ID = "prj_PJH1UBvE0pLWF6xiIFc7OkhFIbCU"; // cosmos2-api-server
const TEAM_ID = "team_15kGsD13J9aJUf5ytEh3tmXD";

function findToken() {
  const roots = [
    `${process.env.APPDATA}\\com.vercel.cli\\Data\\auth.json`,
    `${process.env.APPDATA}\\xdg.data\\com.vercel.cli\\auth.json`,
    `${process.env.APPDATA}\\com.vercel.cli\\auth.json`,
    `${process.env.LOCALAPPDATA}\\com.vercel.cli\\auth.json`,
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

const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}?teamId=${TEAM_ID}`;
const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

const show = (label, p) => {
  console.log(label);
  console.log("  rootDirectory  :", p.rootDirectory);
  console.log("  framework      :", p.framework);
  console.log("  buildCommand   :", p.buildCommand);
  console.log("  outputDirectory:", p.outputDirectory);
  console.log("  installCommand :", p.installCommand);
};

show("BEFORE:", await (await fetch(url, { headers })).json());

// null = inherit from repo-root vercel.json
const res = await fetch(url, {
  method: "PATCH",
  headers,
  body: JSON.stringify({
    rootDirectory: null,
    framework: null,
    buildCommand: null,
    outputDirectory: null,
    installCommand: null,
  }),
});

if (!res.ok) {
  console.error("PATCH failed:", res.status, (await res.text()).slice(0, 400));
  process.exit(1);
}

show("\nAFTER:", await res.json());
console.log("\nSettings now inherit from repo-root vercel.json");
