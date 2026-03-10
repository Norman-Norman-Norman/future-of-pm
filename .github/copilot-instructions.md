# Project Guidelines

## Overview

OctoCAT Supply is a B2B supply chain management demo app. TypeScript monorepo with two workspaces: `api/` (Express REST API) and `frontend/` (React SPA).

## Architecture

- **API**: Express 4 + TypeScript, in-memory seed data (no external DB), Swagger/OpenAPI via JSDoc annotations
- **Frontend**: React 18 + Vite + Tailwind CSS, React Query v3 for server state, React Router DOM 7, Context API for auth/theme
- **Monorepo**: npm workspaces (`api`, `frontend`) managed from root `package.json`
- **Deployment**: Azure Container Apps with Docker, Bicep IaC, GitHub Actions CI/CD

See [docs/architecture.md](../docs/architecture.md) for full details.

## Build and Test

```bash
npm install                    # Install all workspace dependencies
npm run dev                    # Run API + Frontend concurrently (API :3000, Frontend :5137)
npm run dev:api                # API only with tsx hot reload
npm run dev:frontend           # Vite dev server only
npm run build                  # Build all workspaces
npm run test                   # Run all tests (Vitest)
npm run test:api               # API tests only
npm run lint                   # Lint frontend (ESLint flat config)
```

## Code Style

- **TypeScript strict mode** everywhere — both API and frontend tsconfigs enforce `strict: true`
- **API routes**: Express Router with JSDoc Swagger annotations (OpenAPI 3.0). Each route file exports a router with full CRUD. See [api/src/routes/branch.ts](../api/src/routes/branch.ts) for the canonical pattern
- **Frontend components**: Functional React with hooks. PascalCase filenames. Use `useQuery` from React Query for data fetching
- **Styling**: Tailwind utility classes. Custom palette: primary `#76B852`, dark `#0A0A0A`, accent `#8BC34A`. Dark mode via `class` strategy
- **Env vars**: `UPPER_SNAKE_CASE`. Key vars: `PORT`, `API_CORS_ORIGINS`, `CODESPACE_NAME`, `API_HOST`, `API_PORT`

## Conventions

- **Testing**: Vitest + Supertest for API integration tests. Each test file resets state via `beforeEach`. Assertions use `expect(response.status).toBe()` and `toMatchObject()`
- **Models**: TypeScript interfaces in `api/src/models/`. Include Swagger `@openapi` schema definitions in JSDoc
- **API endpoints**: RESTful, plural nouns — `/api/branches`, `/api/orders`, `/api/products`
- **Frontend API config**: Runtime detection in `frontend/src/api/config.ts` — supports Codespaces, containers, and localhost
- **Node requirement**: `>=18`

## GitHub Workflow

- **Issues**: Create on the upstream repo: `Norman-Norman-Norman/future-of-pm`
- **Pull requests**: Create on origin: `MSFT-DEMOS/GitHubCopilot_Customized_TechConnect`
- Use the `commit-and-push` skill for conventional commits
- Use the `create-pull-request` skill for comprehensive PRs
- Use the `create-github-issue` skill for structured issue creation
