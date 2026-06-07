import type { IncomingMessage, ServerResponse } from "node:http";

// Lazy-import to avoid top-level DATABASE_URL check crashing the module
// before Vercel injects the environment variable at request time.
let _handler: ((req: IncomingMessage, res: ServerResponse) => void) | null = null;

async function getHandler() {
  if (_handler) return _handler;
  const { default: app } = await import("../artifacts/api-server/src/app");
  _handler = app as unknown as (req: IncomingMessage, res: ServerResponse) => void;
  return _handler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const h = await getHandler();
  return h(req, res);
}
