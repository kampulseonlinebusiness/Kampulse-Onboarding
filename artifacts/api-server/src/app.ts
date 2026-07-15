import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ── Security headers ──────────────────────────────────────────────────────────
// helmet sets X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security,
// Referrer-Policy, Permissions-Policy, and more on every response.
app.use(
  helmet({
    // CSP is intentionally omitted — it is enforced on the frontend (Vite/CDN layer).
    contentSecurityPolicy: false,
    // HSTS: 1 year, include subdomains, allow preload registration.
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow only the configured frontend origin. Falls back to APP_URL for
// environments that already set that variable.  In development, also allow
// localhost origins so the Vite dev server works without extra config.
const rawOrigin = process.env["CORS_ORIGIN"] ?? process.env["APP_URL"];

const corsOriginList: (string | RegExp)[] = [];

if (rawOrigin) {
  // Support comma-separated list of origins (e.g. "https://kampulseai.com,https://www.kampulseai.com")
  rawOrigin.split(",").map((o) => o.trim()).filter(Boolean).forEach((o) => corsOriginList.push(o));
}

// Always permit Replit preview domains and localhost in development/preview.
corsOriginList.push(/\.replit\.dev$/);
corsOriginList.push(/\.replit\.app$/);
corsOriginList.push(/^https?:\/\/localhost(:\d+)?$/);

app.use(
  cors({
    origin: corsOriginList.length > 0 ? corsOriginList : true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// ── Body parsing ──────────────────────────────────────────────────────────────
// Increase limit for signature data (base64 images)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", router);

export default app;
