/**
 * Clears the dashboard-level overrides that prevent the repo-root vercel.json
 * from taking effect (rootDirectory pinned to artifacts/api-server, framework
 * misdetected as nitro, and build/output commands duplicated in the dashboard).
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const project = JSON.parse(readFileSync(".vercel/project.json", "utf-8"));

// The CLI stores its token in an auth.json under one of these roots.
function findToken() {
  const candidates = [
    `${process.env.APPDATA}\\com.vercel.cli\\auth.json`,
    `${process.env.LOCALAPPDATA}\\com.vercel.cli\\auth.json`,
    `${process.env.USERPROFILE}\\.local\\share\\com.vercel.cli\\auth.json`,
    `${process.env.XDG_DATA_HOME ?? ""}/com.vercel.cli/auth.json`,
    `${process.env.HOME ?? ""}/.local/share/com.vercel.cli/auth.json`,
  ];
  for (const p of candidates) {
    try {
      const j = JSON.parse(readFileSync(p, "utf-8"));
      if (j.token) return j.token;
    } catch {
      /* try next */
    }
  }
  return null;
}

const token = findToken();
if (!token) {
  console.error("Could not locate Vercel CLI token.");
  process.exit(1);
}

const url = `https://api.vercel.com/v9/projects/${project.projectId}?teamId=${project.orgId}`;
const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

const before = await (await fetch(url, { headers })).json();
console.log("BEFORE:");
console.log("  rootDirectory  :", before.rootDirectory);
console.log("  framework      :", before.framework);
console.log("  buildCommand   :", before.buildCommand);
console.log("  outputDirectory:", before.outputDirectory);

// null = "inherit from vercel.json / repo root"
const patch = {
  rootDirectory: null,
  framework: null,
  buildCommand: null,
  outputDirectory: null,
  installCommand: null,
};

const res = await fetch(url, {
  method: "PATCH",
  headers,
  body: JSON.stringify(patch),
});

if (!res.ok) {
  console.error("PATCH failed:", res.status, (await res.text()).slice(0, 400));
  process.exit(1);
}

const after = await res.json();
console.log("\nAFTER:");
console.log("  rootDirectory  :", after.rootDirectory);
console.log("  framework      :", after.framework);
console.log("  buildCommand   :", after.buildCommand);
console.log("  outputDirectory:", after.outputDirectory);
console.log("\nSettings now inherit from repo-root vercel.json");
