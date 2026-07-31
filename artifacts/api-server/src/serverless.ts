/**
 * Serverless entry point (Vercel).
 *
 * Unlike `index.ts`, this does NOT call `app.listen()` — Vercel invokes the
 * exported handler per request. The Express app is exported directly, which
 * Vercel's Node runtime accepts as a request handler.
 *
 * DATABASE_URL and the other secrets are injected by Vercel at runtime, and
 * `lib/db` initialises its pool lazily on first query, so importing this module
 * during the build does not require a live database.
 */
import app from "./app";

export default app;
