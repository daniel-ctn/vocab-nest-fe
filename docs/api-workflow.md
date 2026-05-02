# API Contract Workflow

The frontend and backend share API contracts through `packages/contracts`.
Next.js must stay UI-only and call the Express API through REST endpoints.

## Responsibilities

- `apps/web` owns authentication UI, route protection, dashboard pages,
  vocabulary search UI, dictionary UI, group management UI, daily practice UI,
  settings UI, API client wrapping, form validation, and loading/error/empty
  states.
- `apps/api` owns authentication, database access, AI vocabulary generation,
  dictionary CRUD, groups, daily practice logic, search history, dashboard
  summaries, request validation, and OpenAPI documentation.
- `packages/contracts` owns public Zod request/response schemas and TypeScript
  types that are safe to import in both apps.

## Required Change Flow

1. Update the contract schema in `packages/contracts/src`.
2. Update the backend route implementation in `apps/api/src/routes`.
3. Regenerate frontend API types with `pnpm generate:api`.
4. Update the frontend UI in `apps/web` to call the centralized API client.
5. Run `pnpm typecheck` and tests before shipping.

## Commands

- `pnpm dev` starts all workspace dev scripts.
- `pnpm generate:api` writes `apps/api/openapi.json` and regenerates
  `apps/web/src/lib/api/generated.ts`.
- `pnpm typecheck` runs TypeScript checks across all packages.

## Frontend API Rules

- Configure the backend URL with `NEXT_PUBLIC_API_BASE_URL`.
- Use `apps/web/src/lib/api` for HTTP calls.
- Attach JWTs through the centralized API client.
- Do not import Prisma, database clients, AI SDKs, or backend service modules
  into `apps/web`.
- Do not mock backend data unless demo mode is explicitly added.
- Show `ApiConnectionError` messages when the backend is unavailable.

## Backend API Rules

- Import request and response schemas from `packages/contracts`.
- Validate incoming request bodies, params, and query values with Zod.
- Return consistent API envelopes:
  - success: `{ "success": true, "data": ... }`
  - error: `{ "success": false, "error": { "code": "...", "message": "..." } }`
- Expose `GET /openapi.json`.
- Expose Swagger UI at `GET /docs`.
