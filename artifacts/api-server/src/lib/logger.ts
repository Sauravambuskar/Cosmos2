import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

// Pretty-printing uses a pino worker thread, which is not supported in
// serverless runtimes (Vercel/Lambda) and throws on startup. Fall back to
// plain JSON logging there — the platform captures stdout anyway.
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const usePrettyTransport = !isProduction && !isServerless;

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  ...(usePrettyTransport
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : {}),
});
