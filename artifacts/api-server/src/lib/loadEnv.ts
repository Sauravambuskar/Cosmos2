import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Load environment variables from the nearest `.env` file for local development.
 *
 * In production (Vercel, Replit deployments) env vars are injected by the platform,
 * so this is a no-op when no `.env` file is present. We search a few likely
 * locations because the process cwd differs between `pnpm --filter` dev runs
 * (package dir) and production (`node dist/index.mjs` from the repo root).
 */
export function loadEnv(): void {
  // Node's loadEnvFile is available on Node 20.12+ / 22+.
  const load = (process as unknown as { loadEnvFile?: (p: string) => void }).loadEnvFile;
  if (typeof load !== "function") return;

  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", "..", ".env"), // artifacts/api-server -> repo root
    path.resolve(process.cwd(), "..", "..", "..", ".env"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      try {
        load(candidate);
      } catch {
        /* ignore malformed env file */
      }
      return;
    }
  }
}
