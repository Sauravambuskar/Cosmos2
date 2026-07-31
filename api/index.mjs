/**
 * Vercel serverless function for the whole API.
 *
 * vercel.json rewrites every /api/* request here, and the Express app inside
 * handles its own routing (it mounts all routes under /api).
 *
 * The bundle is produced by `pnpm --filter @workspace/api-server run build`,
 * which runs as part of the Vercel build command. Bundling is required because
 * the workspace packages (@workspace/db) ship raw TypeScript.
 */
export { default } from "../artifacts/api-server/dist/serverless.mjs";
