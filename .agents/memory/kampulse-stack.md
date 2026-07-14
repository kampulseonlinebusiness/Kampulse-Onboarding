---
name: Kampulse Portal Stack Decisions
description: Key non-obvious decisions for the Kampulse Recruitment Portal — auth, PDF, packaging, uploads.
---

## Auth
- JWT stored in localStorage under "kampulse_auth" — NOT session cookies, NOT Replit Auth, NOT Clerk
- `bcryptjs` (pure JS) instead of `bcrypt` (native — pnpm build approval required, unreliable)
- `lib/auth.ts` signs access tokens (15m) and refresh tokens (7d) using separate secrets: JWT_SECRET and JWT_REFRESH_SECRET
- Admin seeded as: admin@kampulse.com / Admin@kampulse123 (super_admin role)

**Why:** User explicitly requested JWT auth. bcrypt native build failed in pnpm (build scripts ignored), bcryptjs works without native compilation.

## PDF Generation (pdfkit)
- pdfkit must be in the `external` list of `artifacts/api-server/build.mjs` — its transitive dependency fontkit uses @swc/helpers which esbuild cannot bundle
- Also externalize: `fontkit`, `linebreak`, `unicode-properties`, `brotli`, `png-js`

**Why:** esbuild bundles pdfkit and hits a "Cannot find module '@swc/helpers/cjs/_define_property.cjs'" error at runtime.

## api-client-react subpath exports
- `lib/api-client-react/package.json` must export both `.` and `./custom-fetch`
- Design subagents will import `setAuthTokenGetter` from `@workspace/api-client-react/custom-fetch`
- Without the subpath export, Vite throws "Missing './custom-fetch' specifier" on startup

**Why:** The design subagent correctly uses setAuthTokenGetter for JWT bearer tokens but the package.json didn't originally have the subpath export registered.

## File Uploads
- Multer routes live outside OpenAPI spec — multipart/form-data causes Zod v4 incompatibilities in Orval codegen
- Upload endpoint: `POST /api/uploads/:token?fileType=TYPE` (raw fetch from frontend, not generated hook)
- Files stored in `uploads/` subdirectory of api-server cwd, served at `/api/uploads/files/*`

## OpenAPI Codegen
- `format: email` must NOT be used in openapi.yaml — Orval generates `zod.email()` which is invalid in Zod v4
- Binary/file upload schemas must NOT be in the spec — causes `zod.instanceof(File)` which also fails in Zod v4
- After removing these, codegen runs clean: `pnpm --filter @workspace/api-spec run codegen`
